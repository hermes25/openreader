import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import ActionSheet from 'react-native-actionsheet';
import TimerMixin from 'react-timer-mixin';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Toast from 'react-native-toast';
import Gallery from 'react-native-gallery';
import Slider from 'react-native-slider';

import Speak from '../module/Speak.js';
import Voice from '../module/Voice.js';
import Share from '../module/Share.js';
import AdView from '../module/AdView.js';
import Cryptor from '../module/Cryptor.js';
import JSContext from '../module/JSContext.js';
import IMView from '../component/read/IMView.js';
import Indicator from '../component/Indicator.js';
import BookmarkView from '../component/read/BookmarkView.js';
import DirectoryView from '../component/read/DirectoryView.js';
import DirectoryTabBar from '../tab/bar/DirectoryTabBar.js';
import BookDAO from '../dao/BookDAO.js';
import MobClick from '../module/MobClick.js';

var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AsyncStorage,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Easing,
    StatusBar,
    Image,
    Linking,
    ScrollView,
} from 'react-native';

var ReadPicture = React.createClass({
    mixins: [TimerMixin],
    bookDao : new BookDAO(),
    gallery : null,
    autoSpeed: 6000,
    pauseAuto : false,
    enableAuto : false,
    isLoadTTS : false,
    isLoadVoice : false,
    isTopPanel: false,
    isBottomPanel: false,
    isDirectoryPanel: false,
    isSetPanel : false,
    isSpeakPanel : false,
    isVoicePanel : false,
    isAutoPanel : false,
    isLightPanel : false,
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
        MobClick.beginLogPageView('picture');
    },
    componentWillUnmount() {
        MobClick.endLogPageView('picture');
    },
    getInitialState() {
      return {
          images: [],
          book: {},
          bookmarks : {},
          model:1,
          left: 15,
          top: 35,
          adKey: null,
          fontSize: 16,
          media: [],
          fontName: 'Heiti SC',
          fontColor: 'rgba(0, 0, 0, 1)',
          infoColor: 'rgba(0, 0, 0, 0.4)',
          backgroundColor: 'rgb(250, 245, 237)',
          showJump: false,
          isNight: false,
          enableSpeak: false,
          enableIM: false,
          jumpNo: 0,
          pageNo: 0,
          chapterNo: 0,
          opacity : 0,
          autoSpeed: 3,
          statusBar: true,
          adHeight: 0,
          directoryPanel: new Animated.Value(Dimensions.get('window').width * -1),
          bottomPanel: new Animated.Value(Dimensions.get('window').height),
          topPanel: new Animated.Value(-65),
          setPanel: new Animated.Value(Dimensions.get('window').height),
          speakPanel: new Animated.Value(Dimensions.get('window').height),
          voicePanel: new Animated.Value(Dimensions.get('window').height),
          autoPanel: new Animated.Value(Dimensions.get('window').height),
          fontPanel: new Animated.Value(Dimensions.get('window').height),
          maskPanel: new Animated.Value(Dimensions.get('window').height),
          lightPanel: new Animated.Value(-80),
      };
    },
    componentDidMount() {
        var _this = this;

        this.refs.indicator.show('正在读取内容...', 'Wave');

        this.setTimeout(() => {
            this.bookDao.findById(this.props.data.id)
            .then((book) => {
              var adHeight = 0;

              AsyncStorage.getItem("bookmarks" + book._id)
              .then((value) => {
                if(value != null){
                  _this.setState({
                    bookmarks:JSON.parse(value)
                  })
                }
              })
              .done();

              AsyncStorage.getItem("chapterNo" + book._id.toString())
              .then((value) => {
                  if(value != null) {
                    _this.setState({
                      chapterNo: parseInt(value)
                    })
                  }
              })
              .done();

              AsyncStorage.getItem("pageNo" + book._id.toString())
              .then((value) => {
                  if(value != null) {
                    _this.setState({
                      pageNo: parseInt(value)
                    })
                  }
              })
              .done();

              if(book.plugins.ad != null && book.plugins.ad.substring(0,3) == 'SDK') {
                  adHeight = 50;
                  AsyncStorage.getItem("read" + book._id)
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

                        var result = await JSContext.call('parseContent', [_this.state.book.chapters[_this.state.chapterNo].url]);

                        var images = [];
                        for(var i=0;i<result.length;i++) {
                          images[images.length] = result[i].url;
                        }

                        _this.setState({
                          images:images
                        });

                        _this.gallery.toPage(_this.state.pageNo);

                        _this.refs.indicator.hide();
                    });
              });
          });
        }, 1000);

    },
    render() {
        var isBookmark = false;

        if(this.state.bookmarks['' + this.state.chapterNo] != null){
          isBookmark = true;
        }

        var media = [];

        for(var i=0;i<this.state.images.length;i++){
          media[media.length] = {photo:this.state.images[i],caption:''};
        }

        var adView = null;

        if(this.state.adHeight > 0) {
          adView = <AdView content={this.state.adKey} style={{width: Dimensions.get('window').width, height: this.state.adHeight, backgroundColor:'#000000'}}></AdView>;
        }

        return (
          <View style={{backgroundColor:'rgb(255, 0, 0)', width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
              <StatusBar
                  showHideTransition={'slide'}
                  hidden={this.state.statusBar}
                  barStyle="light-content"
                  animated
                  translucent
              />
              <View style={{position: 'absolute',width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                  <Gallery
                    style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - this.state.adHeight, backgroundColor: 'black'}}
                    images={this.state.images}
                    rimage={this}
                    onSingleTapConfirmed={() => {this.showToolsPanel(0)}}
                  />
                  {adView}
              </View>
              <View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                position: 'absolute',
                backgroundColor: 'rgb(0, 0, 0)',
                top: 0,
                left: 0,
                opacity : this.state.opacity,
              }}
              pointerEvents="none"></View>
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
                      backgroundColor:'rgba(0, 0, 0, 0.8)'
                    }}></View>
                    <View style={{
                      width: Dimensions.get('window').width,
                      height: 40,
                      paddingLeft: 10,
                      paddingRight: 15,
                      backgroundColor:'rgba(0, 0, 0, 0.8)',
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
                backgroundColor:'rgba(0, 0, 0, 0.8)'}}>
                <ScrollView
                    style={{
                      width:Dimensions.get('window').width,
                      height: 110,
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <View style={{width:80, flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 20}}>
                        <TouchableOpacity
                         style={{width: 70, alignItems: 'center', justifyContent:'space-between'}}
                         onPress={() => this.showToolsPanel(2)}>
                            <Icon2
                              name={'format-list-bulleted'}
                              size={35}
                              color={'rgba(255, 255, 255, 0.95)'}
                            />
                            <Text style={{fontSize: 12, color:'#AAAAAA', marginTop: 20}}>浏览目录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:80, flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 20}}>
                        <TouchableOpacity style={{width: 70, alignItems: 'center', justifyContent:'space-between'}} onPress={() => {
                          this.showToolsPanel(0);
                          this.showLightPanel();
                          this.showMaskPanel();
                        }}>
                          {this.state.isNight?<Icon2
                            name={'lightbulb-outline'}
                            size={35}
                            color={'rgba(252, 98, 77, 1.0)'}
                          />:<Icon2
                            name={'lightbulb-outline'}
                            size={35}
                            color={'rgba(255, 255, 255, 0.8)'}
                          />}
                          <Text style={{fontSize: 12, color:'#AAAAAA', marginTop: 20}}>亮度设置</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:80, flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 20}}>
                            <TouchableOpacity style={{width: 70, alignItems: 'center', justifyContent:'space-between'}} onPress={() => {this.pressVoice()}}>
                                <Icon
                                  name={'ios-mic-outline'}
                                  size={35}
                                  color={'#E9E7E8'}
                                />
                                <Text style={{fontSize: 12, color:'#AAAAAA', marginTop: 20}}>语音控制</Text>
                            </TouchableOpacity>
                    </View>
                    <View style={{width:80, flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 20}}>
                          <TouchableOpacity style={{width: 70, alignItems: 'center', justifyContent:'space-between'}} onPress={() => {
                              this.showToolsPanel();
                              this.enableAuto = true;
                              this.autoTurnPage();
                          }}>
                              <Icon
                                name={'ios-paper-outline'}
                                size={35}
                                color={'#E9E7E8'}
                              />
                              <Text style={{fontSize: 12, color:'#AAAAAA', marginTop: 20}}>自动阅读</Text>
                          </TouchableOpacity>
                    </View>
                    <View style={{width:80, flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginTop: 20}}>
                          <TouchableOpacity style={{width: 70, alignItems: 'center', justifyContent:'space-between'}} onPress={() => {
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
                              <Text style={{fontSize: 12, color:'#AAAAAA', marginTop: 20}}>互动交流</Text>
                          </TouchableOpacity>
                    </View>
                </ScrollView>
              </Animated.View>
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
                width: Dimensions.get('window').width - 20,
                height: 80,
                position: 'absolute',
                top: this.state.lightPanel,
                left: 10,
                justifyContent:'space-between',
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 8,
                backgroundColor:'rgba(0, 0, 0, 0.8)'}}>
                  <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                      <View style={{width:60, alignItems: 'center'}}>
                          <Icon
                            name={'ios-sunny-outline'}
                            size={36}
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
                        onSlidingComplete={(value) => this.setState({opacity:value})} />
                      <View style={{width:60, alignItems: 'center'}}>
                          <Icon
                            name={'ios-sunny-outline'}
                            size={24}
                            color={'rgba(255, 255, 255, 1)'}
                          />
                      </View>
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
                      <Text style={{fontSize:13, color:'rgb(255, 255, 255)', marginTop: 5}}>下一章  自动</Text>
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
                  this.autoSpeed = 12000;
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
                  this.autoSpeed = 9000;
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
                  this.autoSpeed = 6000;
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
                  this.autoSpeed = 3000;
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
                  this.autoSpeed = 1000;
                }}>
                    <View style={{width:30,height:30,borderColor:'rgb(71, 71, 71)', borderWidth: 1, borderRadius: 60,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:13, color:'rgb(71, 71, 71)'}}>100</Text>
                    </View>
                    <Text style={{fontSize:12, color:'rgb(71, 71, 71)', marginTop: 10}}>高速</Text>
                </TouchableOpacity>}
                  <TouchableOpacity onPress={() => {
                      this.enableAuto = false;
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
                    <ScrollableTabView initialPage={1} renderTabBar={() => <DirectoryTabBar />} locked={true} style={{backgroundColor:'rgb(240, 240, 240)', width: Dimensions.get('window').width - 40}} tabBarBackgroundColor="white" showsVerticalScrollIndicator={false} tabBarUnderlineColor="#FFFFFF" tabBarPosition="top">
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
                        this.pressHandleActionSheet(v)
                      }}
                  />
          </View>
        );
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

      if (p == 3) {
        if(this.isSpeakPanel) {
          this.hideSpeakPanel(true);
        } else {
          this.showSpeakPanel();
        }
        return;
      }

      if(this.enableAuto) {
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
    showAutoPanel() {
      this.pauseAuto = true;

      this.isAutoPanel = true;
      Animated.timing(this.state.autoPanel, {
          toValue: Dimensions.get('window').height - 90,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    hideAutoPanel() {
      this.pauseAuto = false;
      this.autoTurnPage();

      this.isAutoPanel = false;
      Animated.timing(this.state.autoPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
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
        this.refs.bookmarkView.setBookmarks(this.state.bookmarks);
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
      if(this.isLightPanel) {
        this.hideLightPanel();
      }

      this.isMaskPanel = false;

      Animated.timing(this.state.maskPanel, {
          toValue: Dimensions.get('window').height,
          duration: this.props.duration,
          easing: this.props.easing,
      }).start();
    },
    showLightPanel() {
      this.isLightPanel = true;

      Animated.timing(this.state.lightPanel, {
          toValue: Dimensions.get('window').height/2-40,
          duration: 0,
          easing: this.props.easing,
      }).start();
    },
    hideLightPanel() {
      this.isLightPanel = false;

      Animated.timing(this.state.lightPanel, {
          toValue: -100,
          duration: 0,
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
    async jumpChapter(chapterNo) {
        this.refs.indicator.show('正在读取内容...', 'Wave');

        this.setState({
          chapterNo: chapterNo,
        });

        var result = await JSContext.call('parseContent', [this.state.book.chapters[this.state.chapterNo].url]);
        var images = [];

        for(var i=0;i<result.length;i++) {
          images[images.length] = result[i].url;
        }

        this.setState({
          images:images
        });

        this.gallery.firstPage();

        this.refs.indicator.hide();
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
    pressHandleActionSheet(index) {
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
    autoTurnPage() {
      this.setTimeout(
        () => {
          if(this.enableAuto && !this.pauseAuto) {
              var result = this.gallery.nextPage();
              if(result == 1) {
                  this.autoTurnPage();
              } else {
                  this.nextChapter();
              }
          }
        },
        this.autoSpeed
      );
    },
    async nextChapter() {
      var chapterNo = this.state.chapterNo + 1;

      if(chapterNo < this.state.book.chapters.length - 1) {
        await this.jumpChapter(chapterNo);
        if(this.enableAuto) {
          this.autoTurnPage();
        }
      }
    },
    async preChapter() {
      var chapterNo = this.state.chapterNo - 1;

      if(chapterNo >= 0) {
        await this.jumpChapter(chapterNo);
        if(this.enableAuto) {
          this.autoTurnPage();
        }
      }
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
    pressBack() {
      const navigator = this.props.navigator;
      if(navigator) {
          AsyncStorage.setItem("chapterNo" + this.state.book._id.toString(), this.state.chapterNo + '').done();
          AsyncStorage.setItem("pageNo" + this.state.book._id.toString(), this.gallery.currentPage + '').done();
          AsyncStorage.setItem("bookmarks" + this.state.book._id.toString(), JSON.stringify(this.state.bookmarks)).done();

          navigator.pop();
      }
    },
    onToast(result) {
      var pinying = result.pinying.toString();
      if(pinying.indexOf('shang yi ye') != -1) {
        Toast.show(result.msg);
        this.gallery.prePage();
      } else if (pinying.indexOf('xia yi ye') != -1) {
        Toast.show(result.msg);
        this.gallery.nextPage();
      } else if (pinying.indexOf('shang yi zhang') != -1 || pinying.indexOf('sang yi zhang') != -1 || pinying.indexOf('sang yi zang') != -1) {
        Toast.show(result.msg);
        this.preChapter();
      } else if (pinying.indexOf('xia yi zhang') != -1 || pinying.indexOf('xia yi zang') != -1) {
        Toast.show(result.msg);
        this.nextChapter();
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
      } else {
        Toast.show(result.msg);
      }
    },
    setGallery(g) {
        this.gallery = g;
    },
});

const styles = StyleSheet.create({
  directoryView : {
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    backgroundColor:'rgb(255, 255, 255)'
  }
});

module.exports = ReadPicture;
