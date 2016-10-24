import BarcodeScanner from 'react-native-barcode-scanner-universal'
import Icon from 'react-native-vector-icons/Ionicons';
import MobClick from '../module/MobClick.js';

import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';

var QRCodeScan = React.createClass({
  getInitialState: function() {
    return {showScanner: true};
  },
  componentWillMount() {
      MobClick.beginLogPageView('qr');
  },
  componentWillUnmount() {
      MobClick.endLogPageView('qr');
  },
  render: function() {
    return (
      <View style={styles.container}>
          <StatusBar
              barStyle="default"
          />
          <View style={styles.topBar}>
              <View style={styles.toolsBar}>
                  <TouchableOpacity style={styles.topLeft} onPress={() => this.pressBack()}>
                        <Icon
                            name={'ios-arrow-back'}
                            size={30}
                            color={'rgb(153, 153, 153)'}
                            style={styles.categoryIcon}
                          />
                  </TouchableOpacity>
                  <View style={styles.topMiddle}>
                      <Text style={styles.subject}>
                          扫一扫
                      </Text>
                  </View>
                  <View style={styles.topRight}>

                  </View>
              </View>
          </View>
          {this.state.showScanner?
              <BarcodeScanner onBarCodeRead={this.onSuccess} captureAudio={false} style={styles.camera}>
                  <View style={styles.finder}>
                    <View style={styles.finderTop}></View>
                    <View style={styles.finderMiddle}>
                        <View style={styles.finderLeft}></View>
                        <View style={styles.finderCenter}>
                            <View style={{height:30, justifyContent:'space-between', flexDirection:'row'}}>
                                <View style={styles.ltCorner}></View>
                                <View style={styles.rtCorner}></View>
                            </View>
                            <View style={{flex:1}}></View>
                            <View style={{height:30, justifyContent:'space-between', flexDirection:'row'}}>
                                <View style={styles.lbCorner}></View>
                                <View style={styles.rbCorner}></View>
                            </View>
                        </View>
                        <View style={styles.finderRight}></View>
                    </View>
                    <View style={styles.finderBottom}>
                          <Text style={styles.hintText}>
                              将二维码放入框内,即可自动扫描
                          </Text>
                    </View>
                  </View>
              </BarcodeScanner>:null
        }
      </View>
    );
  },
  pressBack: function() {
    const navigator = this.props.navigator;
    if(navigator) {
        navigator.pop();
    }
  },
  onSuccess: function(result) {
      this.setState({
        showScanner:false
      });

      const navigator = this.props.navigator;

      if(this.props.data.add) {
          this.props.data.add(result.data);
      }

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
      backgroundColor:'rgb(255, 255, 255)',
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
      color: 'rgb(98, 98, 98)',
      textAlign: 'center',
      fontSize: 20,
  },
  camera: {
    flex: 1
  },
  finder: {
    flex: 1,
  },
  finderTop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1
  },
  finderMiddle: {
    height: 260,
    flexDirection: 'row'
  },
  finderLeft: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignSelf: 'stretch'
  },
  finderCenter: {
    width: 260
  },
  finderRight: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignSelf: 'stretch'
  },
  finderBottom: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignItems: 'center'
  },
  ltCorner: {
    width:30,
    height:30,
    borderTopWidth: 2,
    borderTopColor: 'rgb(252, 98, 77)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgb(252, 98, 77)'
  },
  rtCorner: {
    width:30,
    height:30,
    borderTopWidth: 2,
    borderTopColor: 'rgb(252, 98, 77)',
    borderRightWidth: 2,
    borderRightColor: 'rgb(252, 98, 77)'
  },
  lbCorner: {
    width:30,
    height:30,
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(252, 98, 77)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgb(252, 98, 77)'
  },
  rbCorner: {
    width:30,
    height:30,
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(252, 98, 77)',
    borderRightWidth: 2,
    borderRightColor: 'rgb(252, 98, 77)'
  },
  hintText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 30
  }
});

module.exports = QRCodeScan;
