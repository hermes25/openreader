import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast';
import ActionSheet from 'react-native-actionsheet';
import TimerMixin from 'react-timer-mixin';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import Cryptor from '../module/Cryptor.js';
import JSContext from '../module/JSContext.js';
import Speak from '../module/Speak.js';
import Voice from '../module/Voice.js';
import Share from '../module/Share.js';

import IMView from '../component/read/IMView.js';
import AutoView from '../component/read/AutoView.js';
import Indicator from '../component/Indicator.js';
import CoverView from '../component/read/CoverView.js';
import BookmarkView from '../component/read/BookmarkView.js';
import DirectoryView from '../component/read/DirectoryView.js';
import BookDAO from '../dao/BookDAO.js';
import DirectoryTabBar from '../tab/bar/DirectoryTabBar.js';
import ProcessContent from '../utils/ProcessContent.js';
import MobClick from '../module/MobClick.js';

var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AsyncStorage,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    PixelRatio,
    Animated,
    StyleSheet,
    LayoutAnimation,
    Easing,
    StatusBar,
    Image,
    ListView,
    Linking,
    ScrollView,
    Alert,
} from 'react-native';

var Slider = require('react-native-slider');

var ReadText = React.createClass({
    mixins: [TimerMixin],
    bookDao : new BookDAO(),
    isLoadTTS : false,
    isLoadVoice : false,
    isTopPanel: false,
    isBottomPanel: false,
    isDirectoryPanel: false,
    isSetPanel : false,
    isSpeakPanel : false,
    isVoicePanel : false,
    isAutoPanel : false,
    enableVoice : false,
    isFontPanel : false,
    isMaskPanel : false,
    getDefaultProps: function() {
        return {
            duration: 500,
            easing: Easing.bezier(0.49, 0.1, 0.56, 0.97),
        };
    },
    componentWillMount() {
        MobClick.beginLogPageView('text');
    },
    componentWillUnmount() {
      MobClick.endLogPageView('text');
    },
    getInitialState() {
      ProcessContent.rtext = this;
      return {
          book: {},
          bookmarks : {},
          left: 15,
          top: 35,
          adHeight: 0,
          adKey: null,
          lineSpacing: 12,
          paragraphSpacing: -10,
          spacingMode: 1,
          colorMode: 1,
          fontSize: 16,
          fontName: 'default',
          fontFamily: '系统默认',
          fontColor: 'rgba(0, 0, 0, 1)',
          infoColor: 'rgba(0, 0, 0, 0.4)',
          backgroundColor: 'rgb(250, 245, 237)',
          showJump: false,
          isNight: false,
          isIncrease: true,
          isDecrease: true,
          enableSpeak: false,
          enableAuto: false,
          enableIM: false,
          jumpNo: 0,
          pageNo: 0,
          chapterNo: 0,
          opacity : 0,
          speakSpeed: 5,
          speakPitch: 5,
          speakSex: 1,
          autoSpeed: 3,
          statusBar: true,
          directoryPanel: new Animated.Value(Dimensions.get('window').width * -1),
          bottomPanel: new Animated.Value(Dimensions.get('window').height),
          topPanel: new Animated.Value(-65),
          setPanel: new Animated.Value(Dimensions.get('window').height),
          speakPanel: new Animated.Value(Dimensions.get('window').height),
          voicePanel: new Animated.Value(Dimensions.get('window').height),
          autoPanel: new Animated.Value(Dimensions.get('window').height),
          fontPanel: new Animated.Value(Dimensions.get('window').height),
          maskPanel: new Animated.Value(Dimensions.get('window').height),
      };
    },
    componentDidMount() {
      var _this = this;

      this.refs.indicator.show('正在读取内容...', 'Wave');

      this.setTimeout(() => {
        this.bookDao.findById(this.props.data.id)
        .then((book) => {
            var adHeight = 0;

            AsyncStorage.getItem("fontSize" + book._id.toString())
            .then((value) => {
              if(value != null){
                _this.setState({
                  fontSize:parseInt(value)
                })
              }
            })
            .done();

            AsyncStorage.getItem("colorMode" + book._id.toString())
            .then((value) => {
              if(value != null){
                _this.setState({
                  colorMode:parseInt(value)
                })
                _this.switchColor(parseInt(value));
              }
            })
            .done();

            AsyncStorage.getItem("spacingMode" + book._id.toString())
            .then((value) => {
              if(value != null){
                _this.setState({
                  spacingMode:parseInt(value)
                })
                _this.switchSpacing(parseInt(value));
              }
            })
            .done();

            AsyncStorage.getItem("opacity" + book._id)
            .then((value) => {
              if(value != null){
                _this.setState({
                  opacity:parseFloat(value)
                })
              }
            })
            .done();

            AsyncStorage.getItem("fontName" + book._id)
            .then((value) => {
              if(value != null){
                _this.setState({
                  fontName:value
                })
              }
            })
            .done();

            AsyncStorage.getItem("fontFamily" + book._id)
            .then((value) => {
              if(value != null){
                _this.setState({
                  fontFamily:value
                })
              }
            })
            .done();

            AsyncStorage.getItem("night" + book._id)
            .then((value) => {
              if(value != null){
                if(value == '1') {
                  _this.setState({
                    isNight:false
                  })

                  _this.switchNight(true);
                }
              }
            })
            .done();

            AsyncStorage.getItem("bookmarks" + book._id)
            .then((value) => {
              if(value != null){
                _this.setState({
                  bookmarks:JSON.parse(value)
                })
              }
            })
            .done();

            if(book.plugins.ad != null && book.plugins.ad.substring(0,3) == 'SDK') {
                adHeight = 50;
                AsyncStorage.getItem("read" + book._id.toString())
                .then((value) => {
                    if(value == null) {
                        AsyncStorage.setItem("read" + book._id.toString(), "1").done();
                        _this.setState({
                            adKey: book.plugins.ad
                        });
                    } else {
                      AsyncStorage.getItem("shareAdKeys").then((shareKeys) => {
                          var shareKey = null;

                          if(shareKeys != null) {
                            var keyJson = JSON.parse(shareKeys);
                            shareKey = keyJson[_this.state.book.source];
                          }

                          value = parseInt(value);

                          var count = value % 10;

                          if(shareKey == null) {
                              if(count < 7) {
                                _this.setState({
                                    adKey: book.plugins.ad
                                });
                              } else {
                                UserDefaults.arrayForKey('adkeys').then(result => {
                                  _this.setState({
                                      adKey: result[0]
                                  });
                                });
                              }
                          } else {
                            if(count < 6) {
                              _this.setState({
                                  adKey: book.plugins.ad
                              });
                            } else if (count >= 6 && count < 8) {
                              _this.setState({
                                  adKey: shareKey
                              });
                            } else {
                              UserDefaults.arrayForKey('adkeys').then(result => {
                                _this.setState({
                                    adKey: result[0]
                                });
                              });
                            }
                          }

                          value = value + 1;
                          AsyncStorage.setItem("read" + book._id.toString(), '' + value).done();

                      }).done();
                    }
                })
                .done();
            }

            _this.setState({
                book: book,
                adHeight: adHeight
            });

            var folderPath = RNFS.DocumentDirectoryPath + '/' + book.code;
            var jsPath = folderPath + '/' + book.code;

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

                      JSContext.initJSContext();
                      JSContext.evaluateScript(js);
                      JSContext.evaluateScript(cryData);

                      AsyncStorage.getItem("chapterNo" + _this.state.book._id.toString())
                      .then((value) => {
                          if(value != null) {
                            _this.setState({
                              chapterNo: parseInt(value)
                            })
                          }

                          AsyncStorage.getItem("pageNo" + _this.state.book._id.toString())
                          .then(async (value) => {
                              if(value != null) {
                                _this.setState({
                                  pageNo: parseInt(value)
                                })
                              }

                              ProcessContent.pageNo = _this.state.pageNo;

                              await ProcessContent.loadPre(1);
                              await ProcessContent.loadCur(1);
                              await ProcessContent.loadNext(1);

                              _this.refs.coverView.refreshPage(ProcessContent);
                              _this.refs.coverView.refs.scrollView.scrollTo({x: Dimensions.get('window').width, animated: false});

                              _this.refs.indicator.hide();
                          })
                          .done();

                      })
                      .done();
                  });
            });
        });
      }, 1000);

    },
    render() {
        const tabWidth = (Dimensions.get('window').width - 40) * -1;

        var length = 0;

        if(this.state.book.chapters != null) {
            length = this.state.book.chapters.length;
        }

        var isBookmark = false;

        if(this.state.bookmarks['' + this.state.chapterNo] != null){
          isBookmark = true;
        }

        return (
          <View>
            <StatusBar
                showHideTransition={'slide'}
                hidden={this.state.statusBar}
                barStyle="light-content"
                animated
                translucent
            />
            <View style={{position: 'absolute',}}>
                <CoverView ref={'coverView'} rtext={this} data={this.props.data}/>
                {this.state.enableAuto?<AutoView ref={'autoModel'} rtext={this} data={this.props.data}/>:null}
            </View>
            <View style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              position: 'absolute',
              backgroundColor: 'rgb(0, 0, 0)',
              top: 0,
              left: 0,
              opacity : this.state.opacity,
            }} pointerEvents="none"></View>
            <Animated.View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                top: this.state.maskPanel,
                left: 0,
            }}>
                <TouchableOpacity style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                  position: 'absolute',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  top: 0,
                  left: 0,
                }} onPress={() => this.hideMaskPanel()}></TouchableOpacity>
            </Animated.View>
            <Animated.View style={{
              width: Dimensions.get('window').width,
              height: 65,
              position: 'absolute',
              top: this.state.topPanel,
              flexDirection: 'column',
              }}>
                  <View style={{
                    width: Dimensions.get('window').width,
                    height: 25,
                    backgroundColor:'rgb(46, 44, 45)'
                  }}></View>
                  <View style={{
                    width: Dimensions.get('window').width,
                    height: 40,
                    paddingLeft: 10,
                    paddingRight: 15,
                    backgroundColor:'rgb(45, 45, 45)',
                    justifyContent:'space-between',
                    flexDirection:'row',
                  }}>
                      <TouchableOpacity style={{width: 30, height: 40, alignItems:'center', justifyContent:'center'}} onPress={() => this.pressBack()}>
                          <Icon
                                name={'ios-arrow-back'}
                                size={30}
                                color={'rgba(255, 255, 255, 0.9)'}
                              />
                      </TouchableOpacity>
                      <View style={{width: 120, height: 40, alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                          <TouchableOpacity onPress={() => {
                            this.ActionSheet.show();
                          }}>
                              <Icon
                                name={'ios-thumbs-up'}
                                size={24}
                                color={'rgba(255, 255, 255, 0.9)'}
                              />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.pressBookmark()}>
                              {isBookmark?<Icon
                                name={'ios-bookmark'}
                                size={24}
                                color={'rgba(252, 98, 77, 0.9)'}
                              />:<Icon
                                name={'ios-bookmark'}
                                size={24}
                                color={'rgba(255, 255, 255, 0.9)'}
                              />}
                          </TouchableOpacity>
                          <TouchableOpacity  onPress={() => {
                            this.showToolsPanel(0);

                            AsyncStorage.getItem("adKey")
                            .then((value) => {
                                var parameter = ''

                                if(value != null) {
                                    parameter = '&' + value;
                                }

                                var url = 'siybapp://' + this.state.book.source.replace('http://','') + parameter;

                                Share.share(url, null, url, this.state.book.name);
                            })
                            .done();
                          }}>
                              <Icon
                                name={'md-share'}
                                size={24}
                                color={'rgba(255, 255, 255, 0.9)'}
                              />
                          </TouchableOpacity>
                      </View>
                  </View>
            </Animated.View>
            <Animated.View style={{
              width: Dimensions.get('window').width,
              height: 110,
              position: 'absolute',
              top: this.state.bottomPanel,
              backgroundColor:'rgb(46, 44, 45)'}}>
              <ScrollView
                  style={{
                    width:Dimensions.get('window').width,
                    height: 110,
                  }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity
                       style={{width: 70, alignItems: 'center'}}
                       onPress={() => this.showToolsPanel(2)}>
                          <Icon2
                            name={'format-list-bulleted'}
                            size={35}
                            color={'rgba(255, 255, 255, 0.95)'}
                          />
                          <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>浏览目录</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.showToolsPanel(1)}>
                          <Icon2
                            name={'wrap-text'}
                            size={35}
                            color={'rgba(255, 255, 255, 0.95)'}
                          />
                          <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>样式设置</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity style={{width: 70, alignItems: 'center'}} onPress={() => this.switchNight(false)}>
                        {this.state.isNight?<Icon2
                          name={'lightbulb-outline'}
                          size={35}
                          color={'rgba(252, 98, 77, 1.0)'}
                        />:<Icon2
                          name={'lightbulb-outline'}
                          size={35}
                          color={'rgba(255, 255, 255, 0.8)'}
                        />}
                        <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>夜间模式</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity style={{width: 70, alignItems: 'center'}} onPress={() => this.pressVoice()}>
                          <Icon
                            name={'ios-mic-outline'}
                            size={35}
                            color={'#E9E7E8'}
                          />
                          <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>语音控制</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.pressSpeak()}>
                          <Icon
                            name={'ios-headset-outline'}
                            size={35}
                            color={'#E9E7E8'}
                          />
                          <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>真人朗读</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => {
                          this.setState({
                            enableAuto:true,
                          });
                          this.refs.autoModel.refreshPage(ProcessContent);
                          this.showToolsPanel(0);
                      }}>
                          <Icon
                            name={'ios-paper-outline'}
                            size={35}
                            color={'#E9E7E8'}
                          />
                          <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>自动阅读</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{width:80, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 20}}>
                  <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => {
                    this.setState({
                      enableIM:true,
                    });
                    this.showToolsPanel(0);
                  }}>
                      <Icon
                        name={'ios-chatbubbles-outline'}
                        size={35}
                        color={'#E9E7E8'}
                      />
                      <Text style={{fontSize: 12, color:'#6C6A6B', marginTop: 20}}>互动交流</Text>
                  </TouchableOpacity>
                  </View>
              </ScrollView>
            </Animated.View>
            <Animated.View style={{
              width: Dimensions.get('window').width,
              height: 180,
              position: 'absolute',
              top: this.state.speakPanel,
              backgroundColor:'rgb(46, 44, 45)'}}>
              <View style={{
                width:Dimensions.get('window').width,
                height: 140,
              }}>
                  <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginTop: 5, borderBottomWidth: 1, borderBottomColor: 'rgb(74, 72, 73)', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15}}>
                      <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth:2, borderColor:'rgb(70, 70, 70)', borderRadius: 3}}
                           onPress={() => {
                                this.setState({speakSex:1});
                                Speak.selectMale();
                              }
                            }>
                              {this.state.speakSex == 1?<Text style={{color:'rgb(227, 82, 74)', fontSize: 14}}>普通话男</Text>:<Text style={{color:'rgb(255, 255, 255)', fontSize: 14}}>普通话男</Text>}
                          </TouchableOpacity>
                          <TouchableOpacity style={{width: 100, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth:2, borderColor:'rgb(70, 70, 70)', borderRadius: 3, marginLeft: 10}}
                           onPress={() => {
                             this.setState({speakSex:2});
                             Speak.selectFemale();
                           }
                         }>
                              {this.state.speakSex == 2?<Text style={{color:'rgb(227, 82, 74)', fontSize: 14}}>普通话女</Text>:<Text style={{color:'rgb(255, 255, 255)', fontSize: 14}}>普通话女</Text>}
                          </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
                       onPress={() => {
                        Speak.stop();
                        this.setState({
                          enableSpeak:false
                        });
                        this.hideSpeakPanel(false);
                      }}>
                          <Icon
                            name={'md-power'}
                            size={40}
                            color={'#E9E7E8'}
                          />
                      </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 10}}>
                      <View style={{width:50, alignItems: 'center', marginLeft: 10}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>语速：</Text>
                      </View>
                      <View style={{width:50, alignItems: 'center'}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>慢</Text>
                      </View>
                      <Slider
                        style={{flex:1}}
                        value={this.state.speakSpeed}
                        minimumValue = {1}
                        maximumValue = {10}
                        step = {1}
                        minimumTrackTintColor={'rgb(227, 82, 74)'}
                        maximumTrackTintColor={'rgb(100, 100, 100)'}
                        thumbTintColor={'rgba(43, 43, 43, 0.8)'}
                        thumbStyle = {{borderColor:'rgb(227, 82, 74)', borderWidth:1,}}
                        onSlidingComplete={(value) => {
                            this.setState({
                              speakSpeed : value,
                            });
                            Speak.adjustSpeed(value);
                        }}/>
                      <View style={{width:50, alignItems: 'center'}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>快</Text>
                      </View>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 5}}>
                      <View style={{width:50, alignItems: 'center', marginLeft: 10}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>语调：</Text>
                      </View>
                      <View style={{width:50, alignItems: 'center'}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>低</Text>
                      </View>
                      <Slider
                        style={{flex:1}}
                        value={this.state.speakPitch}
                        minimumValue = {1}
                        maximumValue = {10}
                        step = {1}
                        minimumTrackTintColor={'rgb(227, 82, 74)'}
                        maximumTrackTintColor={'rgb(100, 100, 100)'}
                        thumbTintColor={'rgba(43, 43, 43, 0.8)'}
                        thumbStyle = {{borderColor:'rgb(227, 82, 74)', borderWidth:1,}}
                        onSlidingComplete={(value) => {
                          {
                              this.setState({
                                speakPitch : value,
                              });
                              Speak.adjustPitch(value);
                          }
                        }}/>
                      <View style={{width:50, alignItems: 'center'}}>
                          <Text style={{color:'rgba(255, 255, 255, 1)', fontSize: 13}}>高</Text>
                      </View>
                  </View>
              </View>
            </Animated.View>
            <Animated.View style={{
              width: Dimensions.get('window').width,
              height: 250,
              position: 'absolute',
              top: this.state.setPanel,
              justifyContent:'space-between',
              paddingTop: 20,
              paddingBottom: 20,
              backgroundColor:'rgb(46, 44, 45)'}}>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                    <View style={{width:70, alignItems: 'center'}}>
                        <Icon
                          name={'ios-sunny-outline'}
                          size={24}
                          color={'rgba(255, 255, 255, 1)'}
                        />
                    </View>
                    <Slider
                      style={{flex:1}}
                      value={this.state.opacity}
                      minimumValue = {0}
                      maximumValue = {0.7}
                      step = {0.01}
                      minimumTrackTintColor={'rgb(227, 82, 74)'}
                      maximumTrackTintColor={'rgb(100, 100, 100)'}
                      thumbTintColor={'rgba(43, 43, 43, 0.8)'}
                      thumbStyle = {{borderColor:'rgb(227, 82, 74)', borderWidth:1,}}
                      onSlidingComplete={(value) => this.setState({opacity:value})}/>
                    <View style={{width:70, alignItems: 'center'}}>
                        <Icon
                          name={'ios-sunny-outline'}
                          size={18}
                          color={'rgba(255, 255, 255, 1)'}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {this.state.isDecrease?<TouchableOpacity style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 1, borderRadius: 4, width:80, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 20}} onPress={() => this.adjustFontSize(false)}>
                        <Text style={{fontSize: 18, color: 'rgba(255, 255, 255, 0.8)'}}>A-</Text>
                    </TouchableOpacity>:<View style={{borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 1, borderRadius: 4, width:80, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 20}}>
                        <Text style={{fontSize: 18, color: 'rgba(255, 255, 255, 0.4)'}}>A-</Text>
                    </View>}
                    {this.state.isIncrease?<TouchableOpacity style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 1, borderRadius: 4, width:80, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 10}} onPress={() => this.adjustFontSize(true)}>
                        <Text style={{fontSize: 18, color: 'rgba(255, 255, 255, 0.8)'}}>A+</Text>
                    </TouchableOpacity>:<View style={{borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 1, borderRadius: 4, width:80, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 10}}>
                        <Text style={{fontSize: 18, color: 'rgba(255, 255, 255, 0.4)'}}>A+</Text>
                    </View>}
                    <View style={{width:10, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 15}}>
                        <Text style={{fontSize: 5, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold'}}>|{"\n"}|{"\n"}|{"\n"}|{"\n"}|{"\n"}|</Text>
                    </View>
                    <TouchableOpacity style={{width:80, height:30, justifyContent:'center', alignItems: 'center', marginLeft: 5}} onPress={() => {
                      this.showToolsPanel(0);
                      this.pressFont();
                    }}>
                        <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)'}} numberOfLines={1}>{this.state.fontFamily}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
                    {this.state.colorMode == 1?<View style={{borderRadius: 13, width:35, height:35, backgroundColor:'rgb(232, 232, 232)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, backgroundColor:'rgb(232, 232, 232)'}} onPress={() => this.switchColor(1)}>
                    </TouchableOpacity>}
                    {this.state.colorMode == 2?<View style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(226, 214, 196)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(226, 214, 196)'}} onPress={() => this.switchColor(2)}>
                    </TouchableOpacity>}
                    {this.state.colorMode == 3?<View style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(216, 188, 134)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(216, 188, 134)'}} onPress={() => this.switchColor(3)}>
                    </TouchableOpacity>}
                    {this.state.colorMode == 4?<View style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(149, 207, 163)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(149, 207, 163)'}} onPress={() => this.switchColor(4)}>
                    </TouchableOpacity>}
                    {this.state.colorMode == 5?<View style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(39, 80, 113)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(39, 80, 113)'}} onPress={() => this.switchColor(5)}>
                    </TouchableOpacity>}
                    {this.state.colorMode == 6?<View style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(101, 79, 71)', borderColor:'rgba(252, 98, 77, 0.8)', borderWidth: 1}}>
                    </View>:<TouchableOpacity style={{borderRadius: 13, width:35, height:35, marginLeft: 10, backgroundColor:'rgb(101, 79, 71)'}} onPress={() => this.switchColor(6)}>
                    </TouchableOpacity>}
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
                    {this.state.spacingMode == 1?<View style={{width:78, height:36, borderColor: 'rgba(252, 98, 77, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}}>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </View>:<TouchableOpacity style={{width:78, height:36, borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}} onPress={() => this.switchSpacing(1)}>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </TouchableOpacity>}
                    {this.state.spacingMode == 2?<View style={{width:78, height:36, borderColor: 'rgba(252, 98, 77, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}}>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </View>:<TouchableOpacity style={{width:78, height:36, borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}} onPress={() => this.switchSpacing(2)}>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </TouchableOpacity>}
                    {this.state.spacingMode == 3?<View style={{width:78, height:36, borderColor: 'rgba(252, 98, 77, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}}>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(252, 98, 77, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </View>:<TouchableOpacity style={{width:78, height:36, borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 1, borderRadius: 4, justifyContent:'space-between', alignItems: 'center', flexDirection:'column', paddingTop: 8, paddingBottom: 8}} onPress={() => this.switchSpacing(3)}>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                        <View style={{borderColor: 'rgba(255, 255, 255, 0.8)', borderBottomWidth: 1, width: 25, height: 1}}></View>
                    </TouchableOpacity>}
                </View>
            </Animated.View>
            <Animated.View style={{
              width: Dimensions.get('window').width,
              height: 110,
              position: 'absolute',
              top: this.state.voicePanel,
              justifyContent: 'space-between',
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 25,
              paddingRight: 25,
              flexDirection: 'row',
              backgroundColor:'rgb(46, 44, 45)'}}>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                  <View>
                    <Text style={{fontSize:18, color:'rgb(255, 255, 255)'}}>支持语音命令</Text>
                    <Text style={{fontSize:13, color:'rgb(255, 255, 255)', marginTop: 10}}>上一页  下一页  上一章</Text>
                    <Text style={{fontSize:13, color:'rgb(255, 255, 255)', marginTop: 5}}>下一章  自动  朗读</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {
                  Voice.stop();
                  this.enableVoice = false;
                  this.hideVoicePanel();
                }}>
                    <View style={{width:70,height:70,borderColor:'rgb(255, 255, 255)', borderWidth: 2, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <View style={{width:36,height:36,backgroundColor:'rgb(255, 255, 255)', borderRadius: 6}}></View>
                    </View>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={{
                width: Dimensions.get('window').width,
                height: 90,
                position: 'absolute',
                top: this.state.autoPanel,
                justifyContent: 'space-between',
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20,
                flexDirection: 'row',
                backgroundColor:'rgb(46, 44, 45)'}}>
                {this.state.autoSpeed == 1?<TouchableOpacity>
                    <View style={{width:30,height:30,borderColor:'rgb(252, 98, 77)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(252, 98, 77)'}}>20</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(252, 98, 77)', marginTop: 10}}>低速</Text>
                </TouchableOpacity>:<TouchableOpacity onPress={() => {
                  this.setState({
                    autoSpeed:1,
                  });
                  this.refs.autoModel.switchSpeed(1);
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>20</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>低速</Text>
                </TouchableOpacity>}
                {this.state.autoSpeed == 2?<TouchableOpacity>
                    <View style={{width:30,height:30,borderColor:'rgb(252, 98, 77)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(252, 98, 77)'}}>40</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(252, 98, 77)', marginTop: 10}}>慢速</Text>
                </TouchableOpacity>:<TouchableOpacity onPress={() => {
                  this.setState({
                    autoSpeed:2,
                  });
                  this.refs.autoModel.switchSpeed(2);
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>40</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>慢速</Text>
                </TouchableOpacity>}
                {this.state.autoSpeed == 3 ?<TouchableOpacity>
                    <View style={{width:30,height:30,borderColor:'rgb(252, 98, 77)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(252, 98, 77)'}}>60</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(252, 98, 77)', marginTop: 10}}>正常</Text>
                </TouchableOpacity>:<TouchableOpacity onPress={() => {
                  this.setState({
                    autoSpeed:3,
                  });
                  this.refs.autoModel.switchSpeed(3);
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>60</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>正常</Text>
                </TouchableOpacity>}
                {this.state.autoSpeed == 4?<TouchableOpacity>
                    <View style={{width:30,height:30,borderColor:'rgb(252, 98, 77)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(252, 98, 77)'}}>80</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(252, 98, 77)', marginTop: 10}}>快速</Text>
                </TouchableOpacity>:<TouchableOpacity onPress={() => {
                  this.setState({
                    autoSpeed:4,
                  });
                  this.refs.autoModel.switchSpeed(4);
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>80</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>快速</Text>
                </TouchableOpacity>}
                {this.state.autoSpeed == 5?<TouchableOpacity>
                    <View style={{width:30,height:30,borderColor:'rgb(252, 98, 77)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(252, 98, 77)'}}>100</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(252, 98, 77)', marginTop: 10}}>高速</Text>
                </TouchableOpacity>:<TouchableOpacity onPress={() => {
                  this.setState({
                    autoSpeed:5,
                  });
                  this.refs.autoModel.switchSpeed(5);
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>100</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>高速</Text>
                </TouchableOpacity>}
                  <TouchableOpacity onPress={() => {
                      this.setState({
                        enableAuto: false,
                      })
                      this.hideAutoPanel();
                  }}>
                      <View style={{width:30,height:30,borderColor:'rgb(255, 255, 255)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:12,height:12,backgroundColor:'rgb(255, 255, 255)', borderRadius: 2}}></View>
                      </View>
                      <Text style={{fontSize:12, color:'rgb(255, 255, 255)', marginTop: 10}}>停止</Text>
                  </TouchableOpacity>
                </Animated.View>
                {this.state.enableIM?<IMView rtext={this}/>:null}
            <Animated.View style={[styles.directoryView, {flexDirection:'row' ,width: Dimensions.get('window').width, left: this.state.directoryPanel, backgroundColor: 'rgba(0, 0, 0, 0)',}]}>
                  <ScrollableTabView initialPage={1} renderTabBar={() => <DirectoryTabBar />} locked={true} style={[styles.scrollView, {backgroundColor:'rgb(240, 240, 240)', width: Dimensions.get('window').width - 40}]} tabBarBackgroundColor="white" showsVerticalScrollIndicator={false} tabBarUnderlineColor="#FFFFFF" tabBarPosition="top">
                      <View>
                      </View>
                      <DirectoryView ref={'directoryView'} main={this}/>
                      <View style={{backgroundColor:'rgba(0, 0, 0, 0)'}}>
                      </View>
                      <BookmarkView ref={'bookmarkView'} main={this}/>
                      <View>
                      </View>
                  </ScrollableTabView>
                  <TouchableOpacity style={{
                    width: 40,
                    height: Dimensions.get('window').height,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                  }}
                  onPress={() => this.hideDirectoryPanel()}
                  activeOpacity={1}></TouchableOpacity>
              </Animated.View>
              <Indicator ref={'indicator'} />
              <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="确定要打赏吗？"
                    options={['取消','支付宝打赏']}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={1}
                    onPress={(v) => {
                      this.showToolsPanel(0);
                      this.pressActionSheet(v)
                    }}
                />
          </View>
        );
    },
    showSpeakPanel() {
      this.isSpeakPanel = true;
      Speak.stop();
      Animated.timing(this.state.speakPanel, {
          toValue: (Dimensions.get('window').height - 180),
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideSpeakPanel(isResume) {
      this.isSpeakPanel = false;
      if(isResume) {
        Speak.resume();
      }
      Animated.timing(this.state.speakPanel, {
          toValue: (Dimensions.get('window').height),
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showDirectoryPanel() {
      var _this = this;

      this.isDirectoryPanel = true;

      Animated.timing(this.state.directoryPanel, {
          toValue: 0,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start(async () => {
        var book = await _this.bookDao.findById(_this.props.data.id);
        this.refs.directoryView.setBook(book);
        this.refs.bookmarkView.setBookmarks(_this.state.bookmarks);
      });
    },
    hideDirectoryPanel(no) {
      var _this = this;

      this.isDirectoryPanel = false;

      Animated.timing(this.state.directoryPanel, {
          toValue: Dimensions.get('window').width * -1,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start(() => {
        if(no != null) {
          _this.jumpChapter(parseInt(no));
        }
      });
    },
    showMaskPanel() {
      this.isMaskPanel = true;

      Animated.timing(this.state.maskPanel, {
          toValue: 0,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideMaskPanel() {
      if(this.isFontPanel) {
        this.hideFontPanel();
      }

      this.isMaskPanel = false;

      Animated.timing(this.state.maskPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showToolsPanel(p) {
      if (p == 1) {
        this.hideTopPanel();
        this.hideBottomPanel(this.showSetPanel);
        return;
      }

      if (p == 2) {
        this.hideTopPanel();
        this.hideBottomPanel(this.showDirectoryPanel);
        return;
      }

      if (this.state.enableSpeak) {
        if(this.isSpeakPanel) {
          this.hideSpeakPanel(true);
        } else {
          this.showSpeakPanel();
        }
        return;
      }

      if (p == 4) {
        if(this.isAutoPanel) {
          this.hideAutoPanel();
        } else {
          this.showAutoPanel();
        }
        return;
      }

      if (this.enableVoice) {
        if(this.isVoicePanel) {
          this.hideVoicePanel();
        } else {
          this.showVoicePanel();
        }
        return;
      }

      if (this.isSetPanel) {
        this.hideSetPanel();
        return;
      }

      if (this.isTopPanel) {
        this.hideTopPanel();
      } else {
        this.showTopPanel();
      }

      if (this.isBottomPanel) {
        this.hideBottomPanel();
      } else {
        this.showBottomPanel();
      }

    },
    showTopPanel() {
      this.isTopPanel = true;
      Animated.timing(this.state.topPanel, {
          toValue: 0,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start(() => this.setState({
        statusBar:false,
      }));
    },
    hideTopPanel() {
      this.isTopPanel = false;
      Animated.timing(this.state.topPanel, {
          toValue: -65,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start(() => this.setState({
        statusBar:true,
      }));
    },
    showBottomPanel() {
      this.isBottomPanel = true;
      Animated.timing(this.state.bottomPanel, {
          toValue: (Dimensions.get('window').height - 110),
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideBottomPanel(m) {
      var _this = this;

      this.isBottomPanel = false;

      Animated.timing(this.state.bottomPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start(() => {
          if(m != null) {
              m();
          }
      });
    },
    showAutoPanel() {
      this.isAutoPanel = true;
      Animated.timing(this.state.autoPanel, {
          toValue: Dimensions.get('window').height - 90,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideAutoPanel() {
      this.isAutoPanel = false;
      Animated.timing(this.state.autoPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showSetPanel() {
      this.isSetPanel = true;

      Animated.timing(this.state.setPanel, {
          toValue: Dimensions.get('window').height - 250,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideSetPanel() {
      this.isSetPanel = false;

      Animated.timing(this.state.setPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showVoicePanel() {
      this.isVoicePanel = true;

      Animated.timing(this.state.voicePanel, {
          toValue: Dimensions.get('window').height - 110,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideVoicePanel() {
      this.isVoicePanel = false;

      Animated.timing(this.state.voicePanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showFontPanel() {
      this.isFontPanel = true;

      Animated.timing(this.state.fontPanel, {
          toValue: Dimensions.get('window').height - 110,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideFontPanel() {
      this.isFontPanel = false;

      Animated.timing(this.state.fontPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    switchNight(isInit){
        if(this.state.isNight) {
          this.setState({
            isNight: false,
            backgroundColor: 'rgba(250, 245, 237, 1)',
            fontColor: 'rgba(0, 0, 0, 1)',
            infoColor : 'rgba(0, 0, 0, 0.4)',
          });
        } else {
          this.setState({
            isNight: true,
            backgroundColor: 'rgba(33, 33, 33, 1)',
            fontColor: 'rgba(78, 78, 78, 1.0)',
            infoColor: 'rgba(56, 56, 56, 1.0)',
          });
        }

        this.refs.coverView.refreshPage(ProcessContent);

        if(!isInit) {
          this.showToolsPanel(0);
        }
    },
    async switchSpacing(mode) {
        this.setState({
          spacingMode : mode,
        });

        switch (mode) {
          case 1: {
            this.setState({
              lineSpacing: 12,
              paragraphSpacing: -10,
            });
          }
            break;
          case 2: {
            this.setState({
              lineSpacing: 10,
              paragraphSpacing: -10,
            });
          }
            break;
          case 3: {
            this.setState({
              lineSpacing: 8,
              paragraphSpacing: -10,
            });
          }
            break;
        }

        await ProcessContent.reload();

        this.refs.coverView.refreshPage(ProcessContent);
    },
    async setFontName(name, family) {
        this.setState({
          fontName:name,
          fontFamily: family
        });

        await ProcessContent.reload();

        this.refs.coverView.refreshPage(ProcessContent);
    },
    async adjustFontSize(isIncrease) {
        if (isIncrease) {
            this.setState({
              fontSize: this.state.fontSize + 2,
              isDecrease: true,
            })
        } else {
          this.setState({
            fontSize: this.state.fontSize - 2,
            isIncrease: true,
          })
        }

        if(this.state.fontSize == 12) {
            this.setState({
              isDecrease: false,
            })
        } else if (this.state.fontSize == 30) {
            this.setState({
              isIncrease: false,
            })
        }

        await ProcessContent.reload();

        this.refs.coverView.refreshPage(ProcessContent);
    },
    switchColor(mode) {
        this.setState({
          colorMode : mode,
        });

        switch (mode) {
            case 1: {
              this.setState({
                backgroundColor: 'rgba(221, 221, 221, 1)',
                fontColor: 'rgba(50, 50, 50, 1)',
                infoColor: 'rgba(50, 50, 50, 0.6)',
              });
            }
              break;
            case 2: {
              this.setState({
                backgroundColor: 'rgba(235, 225, 209, 1)',
                fontColor: 'rgba(62, 53, 54, 1)',
                infoColor: 'rgba(62, 53, 54, 0.6)',
              });
            }
              break;
            case 3: {
              this.setState({
                backgroundColor: 'rgba(224, 211, 186, 1)',
                fontColor: 'rgba(63, 52, 52, 1)',
                infoColor: 'rgba(63, 52, 52, 0.6)',
              });
            }
              break;
            case 4: {
              this.setState({
                backgroundColor: 'rgba(203, 233, 206, 1)',
                fontColor: 'rgba(43, 54, 44, 1)',
                infoColor: 'rgba(43, 54, 44, 0.6)',
              });
            }
              break;
            case 5: {
              this.setState({
                backgroundColor: 'rgba(3, 28, 43, 1)',
                fontColor: 'rgba(96, 112, 124, 1)',
                infoColor: 'rgba(96, 112, 124, 0.6)',
              });
            }
              break;
            case 6: {
              this.setState({
                backgroundColor: 'rgba(59, 52, 54, 1)',
                fontColor: 'rgba(151, 146, 145, 1)',
                infoColor: 'rgba(151, 146, 145, 0.6)',
              });
            }
              break;
        }

        this.refs.coverView.refreshPage(ProcessContent);
    },
    async onSpeakEnd() {
      await this.nextPage();
      var text = ProcessContent.curPage;
      Speak.play(text);
    },
    onToast(result) {
      var pinying = result.pinying.toString();
      if(pinying.indexOf('shang yi ye') != -1) {
        Toast.show(result.msg);
        this.prePage();
      } else if (pinying.indexOf('xia yi ye') != -1) {
        Toast.show(result.msg);
        this.nextPage();
      } else if (pinying.indexOf('shang yi zhang') != -1 || pinying.indexOf('sang yi zhang') != -1 || pinying.indexOf('sang yi zang') != -1) {
        Toast.show(result.msg);
        this.jumpChapter(this.state.chapterNo-1)
      } else if (pinying.indexOf('xia yi zhang') != -1 || pinying.indexOf('xia yi zang') != -1) {
        Toast.show(result.msg);
        this.jumpChapter(this.state.chapterNo+1)
      } else if (pinying.indexOf('zi dong') != -1 || pinying.indexOf('zhi dong') != -1) {
        Toast.show(result.msg);

        this.enableAuto = true;
        this.autoTurnPage();

        this.setTimeout(
          () => {
            Voice.stop();
            this.enableVoice = false;
          },
          6000
        );
      } else if (pinying.indexOf('lang du') != -1 || pinying.indexOf('nang du') != -1) {
        Toast.show(result.msg);
      } else {
        Toast.show(result.msg);
      }
    },
    pressActionSheet(index) {
        if(index == 1) {
          Linking.canOpenURL(this.state.book.plugins.reward).then(supported => {
            if (!supported) {
              console.log('Can\'t handle url: ' + this.state.book.plugins.reward);
            } else {
              return Linking.openURL(this.state.book.plugins.reward);
            }
          }).catch(err => console.error('An error occurred', err));
        }
    },
    pressBack() {
      const navigator = this.props.navigator;
      if(navigator) {
        AsyncStorage.setItem("chapterNo" + this.state.book._id.toString(), this.state.chapterNo + '').done();
        AsyncStorage.setItem("pageNo" + this.state.book._id.toString(), ProcessContent.curNo + '').done();
        AsyncStorage.setItem("fontSize" + this.state.book._id.toString(), this.state.fontSize + '').done();
        AsyncStorage.setItem("colorMode" + this.state.book._id.toString(), this.state.colorMode + '').done();
        AsyncStorage.setItem("spacingMode" + this.state.book._id.toString(), this.state.spacingMode + '').done();
        AsyncStorage.setItem("opacity" + this.state.book._id.toString(), this.state.opacity + '').done();
        AsyncStorage.setItem("fontFamily" + this.state.book._id.toString(), this.state.fontFamily + '').done();
        AsyncStorage.setItem("fontName" + this.state.book._id.toString(), this.state.fontName + '').done();
        AsyncStorage.setItem("night" + this.state.book._id.toString(), this.state.isNight?'1':'0').done();
        AsyncStorage.setItem("bookmarks" + this.state.book._id.toString(), JSON.stringify(this.state.bookmarks)).done();

        navigator.pop();
      }
    },
    async pressBookmark() {
      var bookmarks = this.state.bookmarks;

      if(bookmarks['' + this.state.chapterNo] != null) {
        delete bookmarks['' + this.state.chapterNo];
      } else {
        bookmarks['' + this.state.chapterNo] = {name:this.state.book.chapters[this.state.chapterNo].name,no:this.state.chapterNo,state:0};
      }

      this.setState({
        bookmarks: bookmarks,
      });
    },
    async pressSpeak() {
        this.showToolsPanel();

        this.setState({
          enableSpeak:true,
        });

        if(!this.isLoadTTS) {
            Speak.addListener(this.onSpeakEnd);
            Speak.loadTTS(5, 5 ,1);
            this.isLoadTTS = true;
        }

        var text = ProcessContent.curPage;
        Speak.play(text);
    },
    async pressVoice() {
        if(!this.isLoadVoice) {
          Voice.addListener(this.onToast);
          Voice.loadVoice(null);
          this.isLoadVoice = true;
        }

        Voice.start();

        this.showToolsPanel();

        this.enableVoice = true;
    },
    pressFont () {
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.push({
              id: 'font',
              data:{
                  rtext: this,
              }
          })
      }
    },
    async prePage() {
      if (ProcessContent.curNo - 1 == 0) {
        this.refs.indicator.show('正在读取上一章...', 'Wave');
      }

      await ProcessContent.loadNext(0);
      await ProcessContent.loadCur(0);
      await ProcessContent.loadPre(0);

      this.refs.coverView.refreshPage(ProcessContent);

      this.refs.indicator.hide();
    },
    async nextPage() {
      if (ProcessContent.curNo + 2 == ProcessContent.curTotal) {
        this.refs.indicator.show('正在读取下一章...', 'Wave');
      }

      await ProcessContent.loadPre(2);
      await ProcessContent.loadCur(2);
      await ProcessContent.loadNext(2);

      this.refs.coverView.refreshPage(ProcessContent);

      if (this.state.enableAuto) {
        this.refs.autoModel.refreshPage(ProcessContent);
      }

      this.refs.indicator.hide();
    },
    async jumpChapter(chapterNo) {
        this.refs.indicator.show('正在读取内容...', 'Wave');

        this.setState({
          chapterNo: chapterNo,
        });

        ProcessContent.curNo = 0;

        await ProcessContent.loadPre(1);
        await ProcessContent.loadCur(1);
        await ProcessContent.loadNext(1);

        this.refs.coverView.refreshPage(ProcessContent);

        this.refs.indicator.hide();
    },
});

const styles = StyleSheet.create({
  directoryView : {
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    backgroundColor:'rgb(255, 255, 255)'
  },
  scrollView : {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 1
    },
  }
});

module.exports = ReadText;
