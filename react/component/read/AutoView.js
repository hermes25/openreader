import Icon from 'react-native-vector-icons/Ionicons';

import TextView from '../../module/TextView.js'
import DeviceBattery from '../../module/DeviceBattery.js'
import BookDAO from '../../dao/BookDAO.js';
import TimerMixin from 'react-timer-mixin';

var processColor = require('processColor');

import React, {
    Animated,
    Component,
    StyleSheet,
    Easing,
    Text,
    Dimensions,
    PanResponder,
    View
} from 'react-native';

var AutoView = React.createClass({
    mixins: [TimerMixin],
    bookDao : new BookDAO(),
    book : {},
    lastX : 0,
    beginX : 0,
    endX : 0,
    isPause : false,
    duration : 20000,
    lastValue : 0,
    textHeight: 0,
    getInitialState() {
      this.textHeight = Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight;
      this.lastValue = this.textHeight;
      return {
          name:'',
          curPage:{
            'fontName':this.props.rtext.state.fontName,
            'fontSize':this.props.rtext.state.fontSize,
            'fontColor':processColor(this.props.rtext.state.fontColor),
            'lineSpacing':this.props.rtext.state.lineSpacing,
            'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
            'text': '',
          },
          pageNo: 0,
          pageTotal: 0,
          nextName:'',
          nextPage:{
            'fontName':this.props.rtext.state.fontName,
            'fontSize':this.props.rtext.state.fontSize,
            'fontColor':processColor(this.props.rtext.state.fontColor),
            'lineSpacing':this.props.rtext.state.lineSpacing,
            'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
            'text': '',
          },
          nextNo: 0,
          nextTotal: 0,
          autoHeight : new Animated.Value(0),
          time:'',
          batteryLevel:1,
      };
    },
    componentWillMount() {
      var _this = this;

      this.switchSpeed(this.props.rtext.state.autoSpeed);

      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

          onPanResponderGrant: async (evt, gestureState) => {
            // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
            // gestureState.{x,y}0 现在会被设置为0
          },
          onPanResponderMove: (evt, gestureState) => {
            // 最近一次的移动距离为gestureState.move{X,Y}

            // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: async (evt, gestureState) => {
            // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
            // 一般来说这意味着一个手势操作已经成功完成。

            if(gestureState.dx == 0) {
              if (_this.isPause) {
                _this.isPause = false;

                Animated.timing(this.state.autoHeight, {
                    toValue: (this.textHeight),
                    duration: this.duration * (this.lastValue/this.textHeight),
                    easing: Easing.linear,
                }).start((value) => {
                    if(value.finished) {
                      _this.props.rtext.nextPage();
                    }
                });
              } else {
                _this.isPause = true;
                _this.state.autoHeight.stopAnimation(value => {
                      _this.lastValue = this.textHeight - value;
                });
              }

              _this.props.rtext.showToolsPanel(4);
            }

          },
        });

        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();

        if(hours < 10) {
            hours = '0' + hours;
        }

        if(minutes < 10) {
            minutes = '0' + minutes;
        }

        _this.setState({
          time: hours + ':' + minutes
        })

        this.setInterval(
          () => {
            var time = new Date();
            var hours = time.getHours();
            var minutes = time.getMinutes();

            if(hours < 10) {
                hours = '0' + hours;
            }

            if(minutes < 10) {
                minutes = '0' + minutes;
            }

            _this.setState({
              time: hours + ':' + minutes
            })
          },
          60000
        );

        DeviceBattery.getBatteryLevel().then(level => {
          _this.setState({
            batteryLevel:level
          });
        });
    },
    render() {
        var opacity = this.state.autoHeight.interpolate({
            inputRange: [0, this.textHeight - 20, this.textHeight], outputRange: [1, 1, 0],
        });

        return (
          <View
          {...this._panResponder.panHandlers}
          ref={'scrollView'}
          style={{
            position:'absolute',
            top:0,
            left:0,
            width:Dimensions.get('window').width,
            height: Dimensions.get('window').height - this.props.rtext.state.adHeight,
            backgroundColor: this.props.rtext.state.backgroundColor}}
            onTouchStart = {(e) => this.onTouchStart(e)}
            onTouchEnd={(e) => this.onTouchEnd(e)}>
                  <View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height - this.props.rtext.state.adHeight,
                  }}>
                      <View style={{
                        flex: 1,
                        width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                        marginLeft: this.props.rtext.state.left,
                        justifyContent: 'center',
                      }}>
                          <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.nextName}</Text>
                      </View>
                        <View style={{
                          width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                          height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,
                          position: 'relative',
                        }}>
                              <View style={{
                                width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                                height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,
                                position: 'absolute',
                                left: this.props.rtext.state.left,
                              }}>
                                  <TextView
                                    style={{
                                      width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                                      height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,

                                    }}
                                    content={this.state.curPage}
                                    editable={false}
                                    />
                              </View>
                              <View style={{position: 'absolute',flexDirection:'column'}}>
                                  <Animated.View style={{
                                    width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                                    height: this.state.autoHeight,
                                    backgroundColor: this.props.rtext.state.backgroundColor,
                                    overflow: 'hidden',
                                    left: this.props.rtext.state.left
                                  }}>
                                      <TextView
                                        style={{
                                          width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                                          height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,
                                        }}
                                        editable={false}
                                        content={this.state.nextPage}
                                        />
                                  </Animated.View>
                                  <Animated.View style={{
                                    width: Dimensions.get('window').width,
                                    backgroundColor: this.props.rtext.state.backgroundColor,
                                    height: 1,
                                    opacity: opacity,
                                    shadowColor: "#000000",
                                    shadowOpacity: 0.6,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                      height: 3,
                                      width: 0
                                    },
                                  }}></Animated.View>
                              </View>
                        </View>
                     <View style={{
                         flex: 1,
                         flexDirection: 'row',
                         width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                         marginLeft: this.props.rtext.state.left,
                         justifyContent: 'space-between',
                     }}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.nextNo + 1} / {this.state.nextTotal}</Text>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.time}</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <View style={{flexDirection:'row',width:30, marginLeft: 5}}>
                                  <View style={{width:24, height:12, borderColor:this.props.rtext.state.infoColor, borderWidth: 1, borderRadius: 2}}>
                                      <View style={{backgroundColor:this.props.rtext.state.infoColor, width:20, height:8, marginTop:1, marginLeft:1,}}></View>
                                  </View>
                                  <View style={{width:3, height:6, backgroundColor:this.props.rtext.state.infoColor, marginLeft:1, marginTop: 3, borderRadius: 1}}></View>
                                </View>
                            </View>
                        </View>
                     </View>
                  </View>
          </View>
        );
    },
    onTouchStart(e) {
      this.beginX = e.nativeEvent.pageX;
    },
    onTouchEnd(e) {
      this.endX = e.nativeEvent.pageX;
    },
    switchSpeed(p) {
      switch(p) {
          case 1: {
            this.duration = 40000;
          }
          break;
          case 2: {
            this.duration = 30000;
          }
          break;
          case 3: {
            this.duration = 20000;
          }
          break;
          case 4: {
            this.duration = 10000;
          }
          break;
          case 5: {
            this.duration = 5000;
          }
          break;
      }
    },
    async refreshPage(content) {
      var _this = this;

      await this.setState({
        autoHeight: new Animated.Value(0),
        name: content.name,
        pageNo: content.curNo,
        pageTotal: content.curTotal,
        nextNo: content.nextNo,
        nextTotal: content.nextTotal,
        nextName: content.nextName,
        curPage: {
          'fontName':this.props.rtext.state.fontName,
          'fontSize':this.props.rtext.state.fontSize,
          'fontColor':processColor(this.props.rtext.state.fontColor),
          'lineSpacing':this.props.rtext.state.lineSpacing,
          'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
          'text': content.curPage,
        },
        nextPage: {
          'fontName':this.props.rtext.state.fontName,
          'fontSize':this.props.rtext.state.fontSize,
          'fontColor':processColor(this.props.rtext.state.fontColor),
          'lineSpacing':this.props.rtext.state.lineSpacing,
          'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
          'text': content.nextPage,
        },
      });

      Animated.timing(this.state.autoHeight, {
          toValue: (this.textHeight),
          duration: this.duration,
          easing: Easing.linear,
      }).start((value) => {
          if(value.finished) {
            this.setState({
              autoHeight: new Animated.Value(0),
              curPage: this.state.nextPage,
              name: this.state.nextName,
              pageNo: this.state.nextNo,
              pageTotal: this.state.nextTotal,
            });

            _this.props.rtext.nextPage();
          }
      });
    },
});

module.exports = AutoView;
