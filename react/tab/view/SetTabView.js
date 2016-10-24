import Icon from 'react-native-vector-icons/Ionicons';
import Feedback from '../../module/Feedback.js';
import Package from '../../module/Package.js';
import Indicator from '../../component/Indicator.js';
import ActionSheet from 'react-native-actionsheet';
import MD5 from '../../utils/MD5.js';
import RNFS from 'react-native-fs';
var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AsyncStorage,
    Component,
    StyleSheet,
    Text,
    ScrollView,
    PixelRatio,
    Switch,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

var SetTabView = React.createClass({
    getInitialState() {
      return {
        autoUpdate: false,
        cacheState : '1',
        adKey : '',
        updateUrl : '',
        testUrl : '',
      };
    },
    componentWillMount() {
        var _this = this;

        AsyncStorage.getItem("autoUpdate")
        .then((value) => {
            if(value == "true") {
              _this.setState({autoUpdate: true});
            } else if (value == "false") {
              _this.setState({autoUpdate: false});
            }
        })
        .done();

        AsyncStorage.getItem("cacheState")
        .then((value) => {
            _this.setState({cacheState: value});
        })
        .done();

        AsyncStorage.getItem("adKey")
        .then((value) => {
            _this.setState({adKey: value});
        })
        .done();

        AsyncStorage.getItem("UpdateUrl")
        .then((value) => {
            if(value == null) {
              _this.setState({updateUrl: 'http://update.siybapp.com:3000/javascripts/package.js'});
            } else {
              _this.setState({updateUrl: value});
            }
        })
        .done();
    },
    render() {
      AsyncStorage.setItem("autoUpdate", "" + this.state.autoUpdate)
      .done();

        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                      <View style={styles.tlBar}>

                      </View>
                      <View style={styles.tmBar}>
                            <Text style={styles.subject}>设置</Text>
                      </View>
                      <View style={styles.trBar}>

                      </View>
                </View>
                <ScrollView>
                      <View style={styles.space}>
                      </View>
                      <View style={styles.panel}>
                          <View style={[styles.row, {height:55,}]}>
                              <View style={[styles.title]}>
                                  <Text style={styles.titleText}>广告标识</Text>
                              </View>
                              <View style={{flex:1, height: 55}}>
                                  <TextInput
                                   style={{flex:1,textAlign:'right'}}
                                    returnKeyType="done"
                                     placeholder="未设置"
                                      clearButtonMode="while-editing"
                                        value={this.state.adKey}
                                          onChangeText={(text) => {
                                            AsyncStorage.setItem("adKey", text).done();
                                            this.setState({adKey: text});
                                          }}/>
                              </View>
                          </View>
                          <View style={styles.line}></View>
                          <View style={[styles.row, {height:55,}]}>
                              <View style={[styles.title]}>
                                  <Text style={styles.titleText}>包地址</Text>
                              </View>
                              <View style={{flex:1, height: 55}}>
                                  <TextInput
                                   style={{flex:1,textAlign:'right',marginLeft: 10, marginRight: 10, color: 'rgb(150, 150, 150)'}}
                                    returnKeyType="done"
                                     placeholder="未设置"
                                      clearButtonMode="while-editing"
                                        value={this.state.updateUrl}
                                          onChangeText={(text) => {
                                            AsyncStorage.setItem("UpdateUrl", text).done();
                                            this.setState({updateUrl: text});
                                          }}/>
                              </View>
                              <TouchableOpacity onPress={() => this.pressReload()}>
                                <Icon
                                  name={'md-refresh'}
                                  size={28}
                                  color={'rgb(179, 179, 179)'}
                                  style={styles.categoryIcon}
                                />
                              </TouchableOpacity>
                          </View>
                      </View>
                      <View style={styles.space}>
                      </View>
                      <View style={styles.panel}>
                      <View style={styles.row}>
                          <View style={styles.title}>
                              <Text style={styles.titleText}>自动更新目录</Text>
                          </View>
                          <View style={styles.detail}>
                          <Switch
                              onValueChange={(value) => {
                                  this.setState({autoUpdate: value});
                              }}
                              value={this.state.autoUpdate} />
                          </View>
                      </View>
                      <View style={styles.line}></View>
                      <TouchableOpacity style={styles.row} onPress={() => {this.ActionSheet.show()}}>
                          <View style={styles.title}>
                              <Text style={styles.titleText}>缓存状态</Text>
                          </View>
                          <View style={styles.detail}>
                              {this.state.cacheState == '1'?<Text style={styles.detailText}>仅WIFI</Text>:<Text style={styles.detailText}>WIFI和手机网络</Text>}
                              <Icon
                                name={'ios-arrow-forward'}
                                size={20}
                                color={'rgb(196, 196, 196)'}
                                style={styles.arrowIcon}
                              />
                          </View>
                      </TouchableOpacity>
                      </View>
                      <View style={styles.space}>
                      </View>
                      <View style={styles.panel}>
                          <TouchableOpacity style={styles.row} onPress={() => this.pressFeedback()}>
                              <View style={styles.title}>
                                  <Text style={styles.titleText}>意见反馈</Text>
                              </View>
                              <View style={styles.detail}>
                                  <Icon
                                    name={'ios-arrow-forward'}
                                    size={20}
                                    color={'rgb(196, 196, 196)'}
                                    style={styles.arrowIcon}
                                  />
                              </View>
                          </TouchableOpacity>
                          <View style={styles.line}></View>
                          <TouchableOpacity style={styles.row} onPress={() => this.pressAgreement()}>
                              <View style={styles.title}>
                                  <Text style={styles.titleText}>服务条款</Text>
                              </View>
                              <View style={styles.detail}>
                                  <Icon
                                    name={'ios-arrow-forward'}
                                    size={20}
                                    color={'rgb(196, 196, 196)'}
                                    style={styles.arrowIcon}
                                  />
                              </View>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.space}>
                      </View>
                </ScrollView>
                <ActionSheet
                      ref={(o) => this.ActionSheet = o}
                      title="设置缓存下载状态"
                      options={['取消','仅WIFI','WIFI和手机网络']}
                      cancelButtonIndex={0}
                      destructiveButtonIndex={1}
                      onPress={(v) => {
                        this.pressActionSheet(v)
                      }}
                  />
                  <Indicator ref={'indicator'} />
            </View>
        );
    },
    pressReload() {
        var _this = this;

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
                  if(currentVersion != data.version || data.url.indexOf('http://192.168') != -1) {
                    _this.refs.indicator.show('正在更新版本...', 'Wave');

                    fetch(data.url)
                    .then(function(res) {
                      if (res.ok) {
                        res.text().then(function(content){
                          var folderPath = RNFS.DocumentDirectoryPath + '/' + code + '/' + data.version;
                          var filePath = folderPath + '/main.jsbundle';

                          RNFS.mkdir(folderPath).then((success) => {
                            RNFS.writeFile(filePath, content, 'utf8')
                              .then((success) => {
                                AsyncStorage.setItem(code, data.version).done();
                                AsyncStorage.setItem("CurrentSource", code).done();
                                UserDefaults.setStringForKey(data.version, code).then(result => {
                                  UserDefaults.setStringForKey(code, 'CurrentSource').then(result => {
                                    _this.refs.indicator.hide();
                                    Package.reload();
                                  });
                                });
                              })
                              .catch((err) => {
                                console.log(err.message);
                              });
                          }).catch((err) => {
                            console.log(err.message);
                          });

                        });
                      } else {
                        _this.refs.indicator.hide();
                      }
                    });
                  } else {
                    _this.refs.indicator.hide();
                    _this.refs.indicator.showWithTime('当前已是最新版本！', '', 1000);
                  }
                });
              } else {
                console.log("Looks like the response wasn't perfect, got status", res.status);
              }
            });

          }).done();
        }).done();
    },
    pressFeedback() {
      Feedback.present();
    },
    pressActionSheet(index) {
        if(index == 1) {
            AsyncStorage.setItem("cacheState", "1").done();
            this.setState({
              cacheState:'1'
            });
        } else if(index == 2) {
            AsyncStorage.setItem("cacheState", "2").done();
            this.setState({
              cacheState:'2'
            });
        }
    },
    pressAgreement(){
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.push({
              id: 'agreement',
          })
      }
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(244, 244, 244)'
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor:'rgb(255, 255, 255)',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 26,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor:'rgba(0,0,0,0.1)',
        height: 70,
    },
    tlBar: {
        width: 50,
    },
    tmBar: {
        flex: 1,
        alignItems: 'center',
    },
    trBar: {
        width: 50,
        alignItems: 'center',
    },
    subject: {
        marginTop: 10,
        fontSize: 18,
        color: 'rgb(90, 90, 90)'
    },
    space: {
        marginTop: 15,
    },
    panel: {
        backgroundColor:'#FFF',
    },
    row: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 12,
        paddingBottom: 12,
    },
    line: {
        borderBottomWidth:2/PixelRatio.get(),
        borderColor:'rgb(246, 246, 246)',
    },
    titleText: {
        fontSize: 16,
        color: 'rgb(71, 71, 71)',
    },
    detailText:{
        color: '#CCC',
        marginRight: 10
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowIcon: {
        marginTop: 5,
    }
});

module.exports = SetTabView;
