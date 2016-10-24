import RNFS from 'react-native-fs';
import JSContext from '../module/JSContext.js';
import Cryptor from '../module/Cryptor.js';
import MD5 from './MD5.js';
import BookDAO from '../dao/BookDAO.js';

var UserDefaults = require('react-native-userdefaults-ios');

class StoreBook {
    store(obj, url, res)
    {
        res.text().then(function(resData) {
          Cryptor.decryptor(resData,
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

                JSContext.initJSContext();
                JSContext.evaluateScript(js);
                JSContext.evaluateScript(cryData);

                var props = await JSContext.toObject('props');

                var md5 = new MD5();
                var code = md5.calcMD5(props.url);

                var folderPath = RNFS.DocumentDirectoryPath + '/' + code;
                var jsPath = folderPath + '/' + code;

                RNFS.mkdir(folderPath).then((success) => {
                  RNFS.writeFile(jsPath, resData, 'utf8')
                    .then((success) => {})
                    .catch((err) => {
                      console.log(err.message);
                    });
                }).catch((err) => {
                  console.log(err.message);
                });

                props.code = code;
                props.download = 0;
                props.source = url;

                if(props.chapters == null) {
                  props.state = 2;
                } else {
                  props.state = 1;
                  for(var i=0;i<props.chapters.length;i++) {
                    props.chapters[i].state = 0;
                  }
                }

                var plugins = await JSContext.toObject('plugins');

                if(plugins != null) {
                    props.plugins = plugins;

                    if(plugins.ad != null && plugins.ad.substring(0, 3) == 'SDK') {
                        UserDefaults.arrayForKey('adkeys').then(result => {
                          if(result.indexOf(plugins.ad) == -1) {
                              result.push(plugins.ad);

                              UserDefaults.setArrayForKey(result, 'adkeys')
                              .then(result => {});
                          }
                        });
                    }
                } else {
                    props.plugins = {};
                }

                var bookDao = new BookDAO();
                var bookResult = await bookDao.add(props);

                if(obj != null) {
                  if(obj.refs.indicator != null) {
                      obj.refs.indicator.hide();
                      obj.refs.indicator.showWithTime('内容收藏成功', '', 1000);
                  }

                  obj.props.indexJs.updateDirectory();
                }
            });
        })
    }
}

module.exports = StoreBook;
