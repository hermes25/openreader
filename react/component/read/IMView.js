import Icon from 'react-native-vector-icons/Ionicons';
import Sms from '../../module/Sms.js';
import TimerMixin from 'react-timer-mixin';

import React, {
    View,
    Text,
    Image,
    Alert,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';

var IMView = React.createClass({
  mixins: [TimerMixin],
  interval:null,
  second:0,
  scrollX:0,
  getInitialState() {
    Sms.addListener(this.onResult);

    return {
      btntext:'获取验证码',
      phone:'',
      pwd:'',
      nickname:'',
      phone1:'',
      code1:'',
      pwd1:'',
      repwd1:'',
      phone2:'',
      code2:'',
      pwd2:'',
      repwd2:'',
      registerStep:1,
      forgotStep:1,
    };
  },
  componentDidMount() {
  　 DeviceEventEmitter.addListener('keyboardWillShow', (v) => this.updateKeyboardSpace(v));
  　 DeviceEventEmitter.addListener('keyboardWillHide', (v) => this.resetKeyboardSpace(v));
  },
  updateKeyboardSpace(v) {
      var keyboardSpace = v.endCoordinates.height - 100;
      this.refs.scrollView.scrollTo({x: this.scrollX, y: keyboardSpace, animated: true});
  },
  resetKeyboardSpace(v) {
    this.refs.scrollView.scrollTo({x: this.scrollX, y: 0, animated: true});
  },
  componentWillUnmount() {
  　　DeviceEventEmitter.removeAllListeners('keyboardWillShow')
  　　DeviceEventEmitter.removeAllListeners('keyboardWillHide')
  },
  render() {
      return (
            <View style={{position:'absolute',top:0,left:0,width:Dimensions.get('window').width,height:Dimensions.get('window').height,backgroundColor:'rgba(42, 52, 63, 0.8)'}}>
                <ScrollView
                  ref={'scrollView'}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    width:Dimensions.get('window').width,
                    height: Dimensions.get('window').height}}
                    pagingEnabled={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => this.onScrollEnd(e)}>
                      <View
                        style={{
                          width:Dimensions.get('window').width,
                          height:Dimensions.get('window').height
                        }}
                        alignItems='center'
                        justifyContent='center'>
                        <View style={{width:275,height:420,backgroundColor:'#F9F9F9',borderRadius:8,alignItems:'center'}}>
                            <Image style={{width:205,height:150}}
                                   source={require('../../resources/im.png')}
                                   resizeMode="contain"/>
                            <Text style={{color:'#46525D',fontSize:16, marginTop:10}}>欢 迎 使 用 互 动 功 能</Text>
                            <Text style={{color:'#AAAAAA',fontSize:14, marginTop:10}}>与内容发布者进行实时交流</Text>
                            <View style={{marginTop:15,}}>
                                  <TextInput
                                  ref={'searchInput'}
                                  style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入手机号"
                                  clearButtonMode="while-editing"
                                  value={this.state.phone}
                                  onChangeText={(text) => this.setState({phone: text})}/>
                            </View>
                            <View style={{marginTop:10,}}>
                                  <TextInput
                                  ref={'searchInput'}
                                  style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入密码"
                                  clearButtonMode="while-editing"
                                  password={true}
                                  value={this.state.pwd}
                                  onChangeText={(text) => this.setState({pwd: text})}/>
                            </View>
                            <View style={{marginTop:5,width:205,height:29,alignItems:'flex-end'}}>
                                <Text style={{color:'#007AE5',fontSize:12, marginTop:10}} onPress={() => this.pressForgot()}>忘记密码？</Text>
                            </View>
                            <TouchableOpacity style={{marginTop:5,width:205,height:40,borderRadius:4,backgroundColor:'#007AE5',alignItems:'center',justifyContent:'center'}} onPress={() => this.login()}>
                                <Text style={{color:'#FFFFFF', fontSize:14}}>登录</Text>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', marginTop: 15}}>
                                <Text style={{fontSize:12,color:'#6C6C6C'}}>还没有账号？</Text><Text style={{fontSize:12,color:'#007AE5',textDecorationLine:'underline'}} onPress={() => this.pressRegister()}>立即注册</Text>
                            </View>
                            <TouchableOpacity style={{position:'absolute', top: 5, right: 10,backgroundColor:'rgba(0, 0, 0, 0)',borderRadius:30}}
                              onPress={
                                () => {
                                  this.setState({
                                    phone:'',
                                    pwd:'',
                                  });
                                  this.props.rtext.setState({enableIM:false});
                                }}>
                                    <Icon
                                      name={'ios-close'}
                                      size={36}
                                      color={'rgb(180, 180, 180)'}
                                    />
                            </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          width:Dimensions.get('window').width,
                          height:Dimensions.get('window').height
                        }}
                        alignItems='center'
                        justifyContent='center'>
                        <View style={{width:275,height:420,backgroundColor:'#F9F9F9',borderRadius:8,alignItems:'center'}}>
                            <Image style={{width:205,height:150}}
                                   source={require('../../resources/im.png')}
                                   resizeMode="contain"/>
                            <Text style={{color:'#46525D',fontSize:16, marginTop:10}}>注 册 新 用 户</Text>
                            {this.state.registerStep == 1?<View><View style={{marginTop:25,}}>
                                  <TextInput
                                  style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入手机号"
                                  clearButtonMode="while-editing"
                                  value={this.state.phone1}
                                  onChangeText={(text) => this.setState({phone1: text})}/>
                            </View>
                            <View style={{width:205,height:32,marginTop:10,borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,flexDirection:'row',alignItems:'center',}}>
                                  <TextInput
                                  style={{width:130,height:32,borderRadius:4,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入验证码"
                                  clearButtonMode="while-editing"
                                  value={this.state.code1}
                                  onChangeText={(text) => this.setState({code1: text})}/>
                                  <TouchableOpacity style={{width:60,height:32,alignItems:'center', justifyContent:'center'}} onPress={() => this.getVerificationCode('register getVerificationCode')}>
                                    <Text style={{width:60,height:14,fontSize:12,color:'#9D9D9D'}}>{this.state.btntext}</Text>
                                  </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{marginTop:35,width:205,height:40,borderRadius:4,backgroundColor:'#007AE5',alignItems:'center',justifyContent:'center'}} onPress={() => this.pressNextRegister()}>
                                <Text style={{color:'#FFFFFF', fontSize:14}}>下一步</Text>
                            </TouchableOpacity></View>:<View><View style={{marginTop:25,}}>
                                  <TextInput
                                  style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入昵称"
                                  clearButtonMode="while-editing"
                                  value={this.state.nickname}
                                  onChangeText={(text) => this.setState({nickname: text})}/>
                            </View>
                            <View style={{width:205,height:32,marginTop:10,borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,flexDirection:'row',alignItems:'center',}}>
                                  <TextInput
                                  style={{width:205,height:32,borderRadius:4,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请输入密码"
                                  clearButtonMode="while-editing"
                                  value={this.state.pwd1}
                                  password={true}
                                  onChangeText={(text) => this.setState({pwd1: text})}/>
                            </View>
                            <View style={{width:205,height:32,marginTop:10,borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,flexDirection:'row',alignItems:'center',}}>
                                  <TextInput
                                  style={{width:205,height:32,borderRadius:4,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                  returnKeyType="done"
                                  placeholder="请确认密码"
                                  clearButtonMode="while-editing"
                                  value={this.state.repwd1}
                                  password={true}
                                  onChangeText={(text) => this.setState({repwd1: text})}/>
                            </View>
                            <TouchableOpacity style={{marginTop:35,width:205,height:40,borderRadius:4,backgroundColor:'#007AE5',alignItems:'center',justifyContent:'center'}} onPress={() => this.pressFinishRegister()}>
                                <Text style={{color:'#FFFFFF', fontSize:14}}>完成</Text>
                            </TouchableOpacity></View>}
                            <TouchableOpacity style={{position:'absolute', top: 5, right: 10,backgroundColor:'rgba(0, 0, 0, 0)',borderRadius:30}}
                              onPress={
                                () => {
                                  this.setState({
                                    phone:'',
                                    pwd:'',
                                  });
                                  this.props.rtext.setState({enableIM:false});
                                }}>
                                    <Icon
                                      name={'ios-close'}
                                      size={36}
                                      color={'rgb(180, 180, 180)'}
                                    />
                            </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          width:Dimensions.get('window').width,
                          height:Dimensions.get('window').height
                        }}
                        alignItems='center'
                        justifyContent='center'>
                        <View style={{width:275,height:420,backgroundColor:'#F9F9F9',borderRadius:8,alignItems:'center'}}>
                            <Image style={{width:205,height:150}}
                                   source={require('../../resources/im.png')}
                                   resizeMode="contain"/>
                            <Text style={{color:'#46525D',fontSize:16, marginTop:10}}>重 置 登 录 密 码</Text>
                            {this.state.forgotStep == 1?<View>
                                <View style={{marginTop:25,}}>
                                      <TextInput
                                      ref={'searchInput'}
                                      style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                      returnKeyType="done"
                                      placeholder="请输入手机号"
                                      clearButtonMode="while-editing"
                                      value={this.state.phone2}
                                      onChangeText={(text) => this.setState({phone2: text})}/>
                                </View>
                                <View style={{width:205,height:32,marginTop:10,borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,flexDirection:'row',alignItems:'center',}}>
                                      <TextInput
                                      ref={'searchInput'}
                                      style={{width:130,height:32,borderRadius:4,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                      returnKeyType="done"
                                      placeholder="请输入验证码"
                                      clearButtonMode="while-editing"
                                      value={this.state.code2}
                                      onChangeText={(text) => this.setState({code2: text})}/>
                                      <TouchableOpacity style={{width:60,height:32,alignItems:'center', justifyContent:'center'}} onPress={() => this.getVerificationCode('forgot getVerificationCode')}>
                                        <Text style={{width:60,height:14,fontSize:12,color:'#9D9D9D'}}>{this.state.btntext}</Text>
                                      </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{marginTop:35,width:205,height:40,borderRadius:4,backgroundColor:'#007AE5',alignItems:'center',justifyContent:'center'}} onPress={() => this.pressNextForgot()}>
                                    <Text style={{color:'#FFFFFF', fontSize:14}}>下一步</Text>
                                </TouchableOpacity>
                            </View>:<View>
                                <View style={{marginTop:25,}}>
                                      <TextInput
                                      ref={'searchInput'}
                                      password={true}
                                      style={{width:205,height:32,borderRadius:4,borderColor:'#E0E0E0',borderWidth:1,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                      returnKeyType="done"
                                      placeholder="请输入密码"
                                      clearButtonMode="while-editing"
                                      value={this.state.pwd2}
                                      onChangeText={(text) => this.setState({pwd2: text})}/>
                                </View>
                                <View style={{width:205,height:32,marginTop:10,borderColor:'#E0E0E0',borderWidth:1,borderRadius:4,flexDirection:'row',alignItems:'center',}}>
                                      <TextInput
                                      ref={'searchInput'}
                                      password={true}
                                      style={{width:205,height:32,borderRadius:4,fontSize:12,paddingLeft:10, paddingRight:10,}}
                                      returnKeyType="done"
                                      placeholder="请确认密码"
                                      clearButtonMode="while-editing"
                                      value={this.state.repwd2}
                                      onChangeText={(text) => this.setState({repwd2: text})}/>
                                </View>
                                <TouchableOpacity style={{marginTop:35,width:205,height:40,borderRadius:4,backgroundColor:'#007AE5',alignItems:'center',justifyContent:'center'}} onPress={() => this.pressFinishForgot()}>
                                    <Text style={{color:'#FFFFFF', fontSize:14}}>完成</Text>
                                </TouchableOpacity>
                            </View>}
                            <TouchableOpacity style={{position:'absolute', top: 5, right: 10,backgroundColor:'rgba(0, 0, 0, 0)',borderRadius:30}}
                              onPress={
                                () => {
                                  this.setState({
                                    phone:'',
                                    pwd:'',
                                  });
                                  this.props.rtext.setState({enableIM:false});
                                }}>
                                    <Icon
                                      name={'ios-close'}
                                      size={36}
                                      color={'rgb(180, 180, 180)'}
                                    />
                            </TouchableOpacity>
                        </View>
                      </View>
                </ScrollView>
            </View>
      );
  },
   pressRegister() {
     this.refs.scrollView.scrollTo({x: Dimensions.get('window').width, animated: true});
   },
   pressForgot() {
     this.refs.scrollView.scrollTo({x: Dimensions.get('window').width*2, animated: true});
   },
   pressNextForgot() {
     if(this.state.phone2.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '重置登录密码',
         '请输入有效的手机号码！',
       );
       return;
     }

     if(this.state.code2.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '重置登录密码',
         '请输入有效的验证码！',
       );
       return;
     }

     Sms.verificationCode(this.state.code2, this.state.phone2, 'forgot verificationCode');

     this.props.rtext.refs.indicator.show('正在验证手机号', 'FadingCircleAlt');
   },
   pressNextRegister() {
     if(this.state.phone1.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '注册新用户',
         '请输入有效的手机号码！',
       );
       return;
     }

     if(this.state.code1.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '注册新用户',
         '请输入有效的验证码！',
       );
       return;
     }

     Sms.verificationCode(this.state.code1, this.state.phone1, 'register verificationCode');

     this.props.rtext.refs.indicator.show('正在验证手机号', 'FadingCircleAlt');
   },
   pressFinishRegister() {
     if(this.state.nickname.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '注册新用户',
         '请输入有效的昵称！',
       );
       return;
     }

     if(this.state.pwd1.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '注册新用户',
         '请输入有效的密码！',
       );
       return;
     }

     if(this.state.pwd1 != this.state.repwd1) {
       Alert.alert(
         '注册新用户',
         '两次密码输入不一致，请重新输入！',
       );
       return;
     }

     Sms.register(this.state.nickname, this.state.phone1, this.state.pwd1);

     this.props.rtext.refs.indicator.show('正在注册，请稍等...', 'FadingCircleAlt');
   },
   pressFinishForgot() {
     if(this.state.pwd2.replace(/(^\s*)|(\s*$)/g, '') == '') {
       Alert.alert(
         '重置登录密码',
         '请输入有效的密码！',
       );
       return;
     }

     if(this.state.pwd2 != this.state.repwd2) {
       Alert.alert(
         '重置登录密码',
         '两次密码输入不一致，请重新输入！',
       );
       return;
     }

     Sms.forgot(this.state.phone2, this.state.pwd2);

     this.props.rtext.refs.indicator.show('正在重置密码，请稍等...', 'FadingCircleAlt');
   },
   getVerificationCode(type) {
     var _this = this;

     if(type == 'register getVerificationCode') {
       if(!(/^1[3|4|5|7|8]\d{9}$/.test(this.state.phone1))){
            Alert.alert(
              '获取验证码',
              '请输入有效的手机号码！',
            );
            return;
       }
     } else if (type == 'forgot getVerificationCode') {
       if(!(/^1[3|4|5|7|8]\d{9}$/.test(this.state.phone2))){
            Alert.alert(
              '获取验证码',
              '请输入有效的手机号码！',
            );
            return;
       }
     }

     if(_this.second <= 0) {
       Alert.alert(
         '获取验证码',
         '短信验证码已下发，请注意查收！',
       );

       if(type == 'register getVerificationCode') {
          Sms.getVerificationCode(this.state.phone1, 'register getVerificationCode');
       } else if (type == 'forgot getVerificationCode') {
          Sms.getVerificationCode(this.state.phone2, 'forgot getVerificationCode');
       }

       _this.second = 60;

       this.interval = this.setInterval(
         () => {
           _this.second--;

           _this.setState({
             btntext: '等待 ' + _this.second + ' 秒',
           });

           if(_this.second < 0) {
             _this.clearInterval(_this.interval);
             _this.setState({
               btntext: '获取验证码',
             });
           }
         },
         1000
       );
     }
   },
   onResult(result) {
     if (result.type == 'register verificationCode') {
        if(result.code == '1') {
          this.props.rtext.refs.indicator.hide();
          this.setState({
            registerStep:2,
          });
        } else {
          this.props.rtext.refs.indicator.hide();
          Alert.alert(
            '注册新用户',
            result.msg,
          );
        }
     } else if (result.type == 'forgot verificationCode') {
       if(result.code == '1') {
         this.props.rtext.refs.indicator.hide();
         this.setState({
           forgotStep:2,
         });
       } else {
         this.props.rtext.refs.indicator.hide();
         Alert.alert(
           '重置登录密码',
           result.msg,
         );
       }
     } else if (result.type == 'register') {
       if(result.code == '1') {
         this.props.rtext.refs.indicator.hide();
         Alert.alert(
            '注册新用户',
            '新用户注册成功',
            [
              {text: '好', onPress: () => {
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                this.setState({
                  phone1:'',
                  code1:'',
                  nickname:'',
                  pwd1:'',
                  repwd1:'',
                  registerStep:1,
                });
              }},
            ]
          );
       } else {
          this.props.rtext.refs.indicator.hide();
          Alert.alert(
            '注册新用户',
            result.msg,
          );
       }
     } else if (result.type == 'forgot') {
       if(result.code == '1') {
         this.props.rtext.refs.indicator.hide();
         Alert.alert(
            '重置登录密码',
            '密码重置成功',
            [
              {text: '好', onPress: () => {
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                this.setState({
                  phone2:'',
                  code2:'',
                  pwd2:'',
                  repwd2:'',
                  forgotStep:1,
                });
              }},
            ]
          );
       } else {
          this.props.rtext.refs.indicator.hide();
          Alert.alert(
            '重置登录密码',
            result.msg,
          );
       }
     } else if (result.type == 'login') {
          if(result.code == '0') {
            this.props.rtext.refs.indicator.hide();
            Alert.alert(
               '登录互动功能',
               result.msg
             );
          } else {
            this.props.rtext.refs.indicator.hide();
          }
     }
   },
   onScrollEnd(e) {
    this.scrollX = e.nativeEvent.contentOffset.x;
   },
   login() {
     var author = '';

     if(this.props.rtext.state.book.plugins.im != null) {
       author = this.props.rtext.state.book.plugins.im;
     }

     this.props.rtext.refs.indicator.show('正在登录，请稍等...', 'FadingCircleAlt');

     Sms.login(author, this.state.phone, this.state.pwd);
   },
});

export default IMView;
