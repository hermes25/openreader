import Icon from 'react-native-vector-icons/Ionicons';

import TextView from '../../module/TextView.js'
import DeviceBattery from '../../module/DeviceBattery.js'
import BookDAO from '../../dao/BookDAO.js';
import AdView from '../../module/AdView.js';
import TimerMixin from 'react-timer-mixin';

var processColor = require('processColor');

import React, {
    Component,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    Dimensions,
    PanResponder,
    View
} from 'react-native';

var CoverView = React.createClass({
    mixins: [TimerMixin],
    bookDao : new BookDAO(),
    book : {},
    lastX : 0,
    beginX : 0,
    endX : 0,
    getInitialState() {
      return {
          preName: '',
          name: '',
          nextName: '',
          preNo: 0,
          preTotal: 0,
          pageNo: 0,
          pageTotal: 0,
          nextNo: 0,
          nextTotal: 0,
          prePage: {
            'fontName':this.props.rtext.state.fontName,
            'fontSize':this.props.rtext.state.fontSize,
            'fontColor':processColor(this.props.rtext.state.fontColor),
            'lineSpacing':this.props.rtext.state.lineSpacing,
            'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
            'text': '',
          },
          curPage: {
            'fontName':this.props.rtext.state.fontName,
            'fontSize':this.props.rtext.state.fontSize,
            'fontColor':processColor(this.props.rtext.state.fontColor),
            'lineSpacing':this.props.rtext.state.lineSpacing,
            'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
            'text': '',
          },
          nextPage: {
            'fontName':this.props.rtext.state.fontName,
            'fontSize':this.props.rtext.state.fontSize,
            'fontColor':processColor(this.props.rtext.state.fontColor),
            'lineSpacing':this.props.rtext.state.lineSpacing,
            'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
            'text': '',
          },
          time:'',
          batteryLevel:1,
      };
    },
    componentWillMount() {
      var _this = this;

      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

          onPanResponderGrant: async (evt, gestureState) => {
          },
          onPanResponderMove: (evt, gestureState) => {
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: async (evt, gestureState) => {
            if(gestureState.dx == 0) {
              var width = Dimensions.get('window').width;
              var area = width/5;

              if(evt.nativeEvent.pageX < area) {
                _this.props.rtext.prePage();
              } else if (evt.nativeEvent.pageX > (width - area)) {
                _this.props.rtext.nextPage();
              } else {
                _this.props.rtext.showToolsPanel();
              }

              this.refs.scrollView.scrollTo({x: Dimensions.get('window').width, animated: true});
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
    onTouchStart(e) {
      this.beginX = e.nativeEvent.pageX;
    },
    onTouchEnd(e) {
      this.endX = e.nativeEvent.pageX;
    },
    async onScrollEnd(e) {
      var center = Dimensions.get('window').width/2;

      if(this.beginX > center) {
        if(this.beginX - this.endX > 100) {
          await this.props.rtext.nextPage();
        }
      } else {
        if(this.endX - this.beginX > 100) {
          await this.props.rtext.prePage();
        }
      }

      this.refs.scrollView.scrollTo({x: Dimensions.get('window').width, animated: false});
    },
    render() {
        var adView = null;

        if(this.props.rtext.state.adHeight > 0) {
          adView = <AdView content={this.props.rtext.state.adKey} style={{width: Dimensions.get('window').width, height: this.props.rtext.state.adHeight}}></AdView>;
        }

        return (
          <View style={{
            position:'absolute',
            top:0,
            left:0,
            width:Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: this.props.rtext.state.backgroundColor
            }}>
            <ScrollView
            ref={'scrollView'}
            style={{
              width:Dimensions.get('window').width,
              height: Dimensions.get('window').height - this.props.rtext.state.adHeight,
              backgroundColor: this.props.rtext.state.backgroundColor}}
            pagingEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onTouchStart = {(e) => this.onTouchStart(e)}
            onTouchEnd={(e) => this.onTouchEnd(e)}
            onMomentumScrollEnd={(e) => this.onScrollEnd(e)}>
                    <View style={{width:Dimensions.get('window').width, height: Dimensions.get('window').height - this.props.rtext.state.adHeight,}}>
                        <View style={{
                          flex: 1,
                          width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                          marginLeft: this.props.rtext.state.left,
                          justifyContent: 'center',
                        }}>
                            <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.preName}</Text>
                        </View>
                        <TextView
                          style={{
                            width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                            height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,
                            marginLeft: this.props.rtext.state.left,
                          }}
                          content={this.state.prePage}
                          editable={false}
                          />
                       <View style={{
                           flex: 1,
                           flexDirection: 'row',
                           width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                           marginLeft: this.props.rtext.state.left,
                           justifyContent: 'space-between',
                       }}>
                          <View style={{justifyContent: 'center'}}>
                              <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.preNo + 1} / {this.state.preTotal}</Text>
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
                    <View {...this._panResponder.panHandlers} style={{width:Dimensions.get('window').width, height: Dimensions.get('window').height - this.props.rtext.state.adHeight,}}>
                        <View style={{
                          flex: 1,
                          width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                          marginLeft: this.props.rtext.state.left,
                          justifyContent: 'center',
                        }}>
                            <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.name}</Text>
                        </View>
                        <TextView
                          style={{
                            width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                            height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2  - this.props.rtext.state.adHeight,
                            marginLeft: this.props.rtext.state.left,
                          }}
                          content={this.state.curPage}
                          editable={false}
                          />
                       <View style={{
                           flex: 1,
                           flexDirection: 'row',
                           width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                           marginLeft: this.props.rtext.state.left,
                           justifyContent: 'space-between',
                       }}>
                          <View style={{justifyContent: 'center'}}>
                              <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.pageNo + 1} / {this.state.pageTotal}</Text>
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
                    <View style={{width:Dimensions.get('window').width, height: Dimensions.get('window').height - this.props.rtext.state.adHeight,}}>
                        <View style={{
                          flex: 1,
                          width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                          marginLeft: this.props.rtext.state.left,
                          justifyContent: 'center',
                        }}>
                            <Text style={{fontSize:12, color: this.props.rtext.state.infoColor}}>{this.state.nextName}</Text>
                        </View>
                        <TextView
                          style={{
                            width: Dimensions.get('window').width - this.props.rtext.state.left*2,
                            height: Dimensions.get('window').height - this.props.rtext.state.top*2 + this.props.rtext.state.lineSpacing*2 - this.props.rtext.state.adHeight,
                            marginLeft: this.props.rtext.state.left,
                          }}
                          editable={false}
                          content={this.state.nextPage}
                          />
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
            </ScrollView>
            {adView}
          </View>
        );
    },
    async refreshPage(content) {
      this.setState({
        preName: content.preName,
        name: content.name,
        nextName: content.nextName,
        pageNo: content.curNo,
        pageTotal: content.curTotal,
        preNo: content.preNo,
        preTotal: content.preTotal,
        nextNo: content.nextNo,
        nextTotal: content.nextTotal,
        prePage: {
          'fontName':this.props.rtext.state.fontName,
          'fontSize':this.props.rtext.state.fontSize,
          'fontColor':processColor(this.props.rtext.state.fontColor),
          'lineSpacing':this.props.rtext.state.lineSpacing,
          'paragraphSpacing':this.props.rtext.state.paragraphSpacing,
          'text': content.prePage,
        },
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
    },
});

module.exports = CoverView;
