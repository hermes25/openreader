import Icon from 'react-native-vector-icons/Ionicons';
import Server from '../module/Server.js'
import MobClick from '../module/MobClick.js';

import React, {
    Component,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    View
} from 'react-native';

var UploadFont = React.createClass({
  getInitialState: function() {
    return {
      ipAddr: '',
    };
  },
  async componentWillMount() {
      MobClick.beginLogPageView('uploadFont');

      var ipAddr = await Server.start(null);
      this.setState({
        ipAddr:ipAddr,
      })
  },
  componentWillUnmount() {
    MobClick.endLogPageView('uploadFont');
  },
  render: function() {
    return (
      <View style={styles.container}>
          <StatusBar
              hidden={false}
              barStyle="light-content"
          />
          <View style={styles.topBar}>
              <View style={styles.toolsBar}>
                  <TouchableOpacity style={styles.topLeft} onPress={() => this.pressBack()}>
                          <Icon
                            name={'ios-arrow-back'}
                            size={30}
                            color={'rgb(255, 255, 255)'}
                            style={styles.categoryIcon}
                          />
                  </TouchableOpacity>
                  <View style={styles.topMiddle}>
                      <Text style={styles.subject}>
                          字体上传
                      </Text>
                  </View>
                  <View style={styles.topRight}>

                  </View>
              </View>
          </View>
          <View style={{alignItems:'center', justifyContent:'center'}}>
              <Image style={{width:225,height:96,marginTop:60}}
                     source={require('../resources/wifi.png')}
                     resizeMode="contain"/>
              <Text style={{fontSize:14, marginTop: 60, fontWeight:'bold'}}>在PC的浏览器中访问以下地址</Text>
              <View style={{marginTop:20,paddingTop:8, paddingLeft:40, paddingRight:40, paddingBottom:8, borderRadius:15, backgroundColor:'#F05551'}}>
                  <Text style={{fontSize:14, color:'rgb(255, 255, 255)'}}>
                    {this.state.ipAddr}
                  </Text>
              </View>
              <View style={{width: 230,marginTop: 30, alignItems:'center'}}>
                  <Text style={{fontSize:14, color:'#BCBCBC', alignItems:'center',textAlign:'center'}}>确保您的手机和PC在同一局域网，上传过程中，请勿关闭此页面</Text>
              </View>
          </View>
      </View>
    );
  },
  pressBack: function() {
    Server.stop(null);

    this.props.data.fontView.loadFonts();

    const navigator = this.props.navigator;
    if(navigator) {
        navigator.pop();
    }
  },
});

var styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  topBar: {
      flexDirection: 'row',
      height:70,
      backgroundColor:'rgb(46, 44, 45)',
  },
  toolsBar: {
      flex:1,
      flexDirection: 'row',
      marginTop:20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  topLeft: {
      width:50,
      alignItems: 'center',
  },
  topMiddle: {
      flex:1,
  },
  topRight: {
      width:50,
      alignItems: 'center',
  },
  subject: {
      color: 'rgb(255, 255, 255)',
      textAlign: 'center',
      fontSize: 20,
  },
});

module.exports = UploadFont;
