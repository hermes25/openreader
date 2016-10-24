import Home from './react/controller/Home.js';
import UploadFont from './react/controller/UploadFont.js';
import SelectFont from './react/controller/SelectFont.js';
import Browse from './react/controller/Browse.js';
import QRCodeScan from './react/controller/QRCodeScan.js'
import Detail from './react/controller/Detail.js'
import ReadText from './react/controller/ReadText.js'
import ReadPicture from './react/controller/ReadPicture.js'
import Agreement from './react/controller/Agreement.js'
import Cryptor from './react/module/Cryptor.js';
import JSContext1 from './react/module/JSContext.js';
import JSContext2 from './react/module/JSContext.js';
import BookDAO from './react/dao/BookDAO.js';
import MD5 from './react/utils/MD5.js';
import RNFS from 'react-native-fs';
var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AsyncStorage,
    AppRegistry,
    Component,
    Navigator,
    NetInfo,
} from 'react-native';

var Reader = React.createClass({
    bookDao : new BookDAO(),
    updating: null,
    downloading: null,
    md5:new MD5(),
    componentWillMount() {
      var _this = this;

      this.updatePackage();

      AsyncStorage.getItem("autoUpdate")
      .then((value) => {
          if(value == "true") {
            this.bookDao.find().then(async function(data){
               for(var i=0; i<data.length; i++) {
                  var book = data[i];
                  book.state = 3;
                  await _this.bookDao.updateById(book, book._id);
               }
               _this.updateDirectory();
            });
          } else {
              _this.updateDirectory();
          }
      })
      .done();

      AsyncStorage.getItem("cacheState")
      .then((value) => {
          if(value == "1") {
              NetInfo.fetch().done((reach) => {
                if(reach == 'wifi') {
                  this.downloadChapter();
                }
              });
          } else if (value == "2") {
              this.downloadChapter();
          }
      })
      .done();

      function handleFirstConnectivityChange(reach) {
        if(reach == 'wifi') {
          _this.downloadChapter();
        }
      }
      NetInfo.addEventListener(
        'change',
        handleFirstConnectivityChange
      );
    },
    async updatePackage() {
      var currentVersion = null;
      var updateUrl = null;

      AsyncStorage.getItem("UpdateUrl")
      .then((value) => {
        if(value == null) {
          updateUrl = "http://update.siybapp.com:3000/javascripts/package.js";
          AsyncStorage.setItem("UpdateUrl", updateUrl).done();
        } else {
          updateUrl = value;
          if(updateUrl.indexOf('http://') == -1) {
              updateUrl = "http://update.siybapp.com:3000/javascripts/package.js";
              AsyncStorage.setItem("UpdateUrl", updateUrl).done();
          }
        }

        var md5 = new MD5();
        var code = md5.calcMD5(updateUrl);

        AsyncStorage.getItem(code)
        .then((value) => {
          if(value == null) {
            currentVersion = "1.0.0";
            AsyncStorage.setItem(code, "1.0.0").done();
          } else {
            currentVersion = value;
          }

          fetch(updateUrl)
          .then(function(res) {
            if (res.ok) {
              res.json().then(function(data){
                if(currentVersion != data.version) {
                  fetch(data.url)
                  .then(function(res) {
                    if (res.ok) {
                      res.text().then(function(content){
                        var folderPath = RNFS.DocumentDirectoryPath + '/' + code + '/' + data.version;
                        var filePath = folderPath + '/main.jsbundle';

                        RNFS.mkdir(folderPath).then((success) => {
                          RNFS.writeFile(filePath, content, 'utf8')
                            .then((success) => {
                              AsyncStorage.setItem("CurrentVersion", data.version).done();
                              AsyncStorage.setItem("CurrentSource", code).done();
                              UserDefaults.setStringForKey(data.version, 'CurrentVersion').then(result => {});
                              UserDefaults.setStringForKey(code, 'CurrentSource').then(result => {});
                            })
                            .catch((err) => {
                              console.log(err.message);
                            });
                        }).catch((err) => {
                          console.log(err.message);
                        });

                      });
                    } else {
                      console.log("Looks like the response wasn't perfect, got status", res.status);
                    }
                  });
                }
              });
            } else {
              console.log("Looks like the response wasn't perfect, got status", res.status);
            }
          });

        }).done();
      }).done();
    },
    updateDirectory() {
        var _this = this;

        if(_this.updating == null) {
            this.bookDao.find({
              where: {
                  or: [{state:2}, {state:3}] // 2、获取内容目录；3、用户点击更新操作
              }
            }).then(function(data) {
              if(data != null && data.length > 0) {
                  _this.updating = data[data.length-1];

                  var folderPath = RNFS.DocumentDirectoryPath + '/' + _this.updating.code;
                  var jsPath = folderPath + '/' + _this.updating.code;

                  RNFS.readFile(jsPath, 'utf8').then((data) => {
                      Cryptor.decryptor(data,
                        async function(error,cryData){
                            var js = 'var parseLast = null;'
                                    + 'var parseDirectory = null;'
                                    + 'var parseContent = null;'
                                    + 'var props = {};'
                                    + 'props.config = function(p) {'
                                    + 'props = p;'
                                    + '};'
                                    + 'var plugins = {};'
                                    + 'plugins.config = function(p) {'
                                    + 'plugins = p;'
                                    + '};'
                                    + 'var parse = {};'
                                    + 'parse.config = function(p) {'
                                    + 'parseLast = p.last;'
                                    + 'parseDirectory = p.directory;'
                                    + 'parseContent = p.content;'
                                    + '};';

                            JSContext1.initJSContext();
                            JSContext1.evaluateScript(js);
                            JSContext1.evaluateScript(cryData);

                            var chapters = await JSContext1.call('parseDirectory', null);
                            for (var i=0; i < chapters.length; i++) {
                                chapters[i].state = 0;
                            }

                            _this.updating.chapters = chapters;
                            _this.updating.state = 1;
                            _this.updating.last = chapters[chapters.length-1].name;

                            await _this.bookDao.updateById(_this.updating, _this.updating._id);

                            _this.updating = null;

                            _this.updateDirectory();
                        });
                  });
              }

            });
        }
    },
    downloadChapter() {
      var _this = this;

      if(_this.downloading == null) {
          this.bookDao.find({
              where: {
                download:1
              }
          }).then(function(data){
            if(data != null && data.length > 0) {
                _this.downloading = data[data.length-1];

                var folderPath = RNFS.DocumentDirectoryPath + '/' + _this.downloading.code;

                var jsPath = folderPath + '/' + _this.downloading.code;

                RNFS.readFile(jsPath, 'utf8').then((data) => {
                    Cryptor.decryptor(data,
                      async function(error,cryData){
                          var js = 'var parseLast = null;'
                                  + 'var parseDirectory = null;'
                                  + 'var parseContent = null;'
                                  + 'var props = {};'
                                  + 'props.config = function(p) {'
                                  + 'props = p;'
                                  + '};'
                                  + 'var plugins = {};'
                                  + 'plugins.config = function(p) {'
                                  + 'plugins = p;'
                                  + '};'
                                  + 'var parse = {};'
                                  + 'parse.config = function(p) {'
                                  + 'parseLast = p.last;'
                                  + 'parseDirectory = p.directory;'
                                  + 'parseContent = p.content;'
                                  + '};';

                          JSContext2.initJSContext();
                          JSContext2.evaluateScript(js);
                          JSContext2.evaluateScript(cryData);

                          for(var i=0;i < _this.downloading.chapters.length; i++) {
                            if(_this.downloading.chapters[i].state == 1) {
                                var code = _this.md5.calcMD5(_this.downloading.chapters[i].url);

                                var content = await JSContext2.call('parseContent', [_this.downloading.chapters[i].url]);
                                var filePath = folderPath + '/' + code;

                                await RNFS.writeFile(filePath, content[0], 'utf8');

                                _this.downloading.chapters[i].code = code;
                                _this.downloading.chapters[i].state = 2;
                              }
                          }

                          _this.downloading.download = 0;

                          await _this.bookDao.updateById(_this.downloading, _this.downloading._id);

                          _this.downloading = null;

                          _this.downloadChapter();
                      });
                });
            }

          });
      }
    },
    navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
            case 'home':
                return (<Home navigator={navigator} indexJs={this}/>);
            case 'qr':
                return (<QRCodeScan navigator={navigator} data={route.data}/>);
            case 'browse':
                return (<Browse navigator={navigator} data={route.data} indexJs={this}/>);
            case 'detail':
                return (<Detail navigator={navigator} data={route.data} indexJs={this}/>);
            case 'rtext':
                return (<ReadText navigator={navigator} data={route.data} indexJs={this}/>);
            case 'rimage':
                return (<ReadPicture navigator={navigator} data={route.data} indexJs={this}/>);
            case 'upload':
                return (<UploadFont navigator={navigator} data={route.data}/>);
            case 'font':
                return (<SelectFont navigator={navigator} data={route.data}/>);
            case 'agreement':
                return (<Agreement navigator={navigator}/>)
        }
    },
    render() {
      return (
            <Navigator
                initialRoute={{id: 'home'}}
                renderScene={this.navigatorRenderScene}/>
        );
    }
});

AppRegistry.registerComponent('Reader', () => Reader);
