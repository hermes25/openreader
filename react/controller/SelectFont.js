import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import Label from '../module/Label.js';
import MobClick from '../module/MobClick.js';

var processColor = require('processColor');

import React, {
    Component,
    StyleSheet,
    Text,
    ListView,
    Dimensions,
    Navigator,
    TouchableOpacity,
    StatusBar,
    View
} from 'react-native';

var SelectFont = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});

    return {
      fontName: this.props.data.rtext.state.fontName,
      dataSource: ds.cloneWithRows([]),
    };
  },
  componentWillMount() {
    this.loadFonts();

    MobClick.beginLogPageView('detail');
  },
  componentWillUnmount() {
    MobClick.endLogPageView('detail');
  },
  renderRow : function (rowData) {
    var content = {
      'fontFile':rowData.path,
      'fontSize':35,
      'fontColor':processColor('rgb(154, 154, 154)'),
      'text':'阅'
    };

    var width = Dimensions.get('window').width/3;

    if(rowData.name == 'default') {
      return (
        <View key={rowData.name} style={{width:width, height:100, flexDirection:'column', justifyContent:'space-between', alignItems:'center', marginTop: 20}}>
            <TouchableOpacity onPress={() => {
              this.props.data.rtext.setFontName('default', '系统默认')
              this.setState({
                fontName:"default",
              });
            }}>
                <View style={{width:70, height:70, alignItems:'center', justifyContent:'center', flexDirection:'row',backgroundColor:'rgb(255, 255, 255)',borderColor:'rgb(171, 171, 171)', borderWidth: 1,position:'relative'}}>
                    <Text style={{width:40, height: 40, fontSize:35, color: 'rgb(154, 154, 154)'}}>阅</Text>
                    {this.state.fontName == "default"?<View style={{position:'absolute', right:-10, bottom:-10, backgroundColor:'rgba(0,0,0,0)'}}>
                        <Icon
                          name={'ios-checkmark-circle'}
                          size={30}
                          color={'rgb(252, 98, 77)'}
                          style={styles.categoryIcon}
                        />
                    </View>:null}
                </View>
            </TouchableOpacity>
            <Text style={{fontSize: 13, color: '#6C6A6B', width:60,}} numberOfLines={1}>系统默认</Text>
          </View>
      );
    } else {
      return (
        <View key={rowData.name} style={{width:width, height:100, flexDirection:'column', justifyContent:'space-between', alignItems:'center', marginTop: 20}}>
            <TouchableOpacity onPress={() => {
              this.props.data.rtext.setFontName(rowData.path, rowData.name);
              this.setState({
                fontName:rowData.path,
              });
            }}>
                <View style={{width:70, height:70, alignItems:'center', justifyContent:'center', flexDirection:'row',backgroundColor:'rgb(255, 255, 255)',borderColor:'rgb(171, 171, 171)', borderWidth: 1,position:'relative'}}>
                    <Label
                    style={{width:40, height: 40, backgroundColor:'rgba(0, 0, 0, 0)'}}
                    content={content}/>
                    {this.state.fontName == rowData.path?<View style={{position:'absolute', right:-10, bottom:-10, backgroundColor:'rgba(0,0,0,0)'}}>
                        <Icon
                          name={'ios-checkmark-circle'}
                          size={30}
                          color={'rgb(252, 98, 77)'}
                          style={styles.categoryIcon}
                        />
                    </View>:null}
                </View>
            </TouchableOpacity>
            <Text style={{fontSize: 13, color: '#6C6A6B', width:60,}} numberOfLines={1}>{rowData.name}</Text>
          </View>
      );
    }

  },
  render () {
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
                          设置字体
                      </Text>
                  </View>
                  <View style={styles.topRight}>
                      <TouchableOpacity onPress={() => this.pressUpload()}>
                          <Text style={{fontSize:16, color:'rgb(255, 255, 255)'}}>增加</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
          <ListView contentContainerStyle={styles.list}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}/>
      </View>
    );
  },
  loadFonts() {
    RNFS.exists(RNFS.DocumentDirectoryPath + '/fonts').then((isExists) => {
      if(isExists) {
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/fonts')
        .then((result) => {
            result.splice(0,0,{name:'default',path:'default'});
            this.setState({
              dataSource:this.state.dataSource.cloneWithRows(result)
            })
        });
      } else {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/fonts')
        .then((result) => {
            this.setState({
              dataSource:this.state.dataSource.cloneWithRows([{name:'default',path:'default'}])
            })
        });
      }
    });
  },
  pressBack() {
    const navigator = this.props.navigator;
    if(navigator) {
        navigator.pop();
    }
  },
  pressUpload() {
    const navigator = this.props.navigator;
    if(navigator) {
        navigator.push({
            id: 'upload',
            data:{
                fontView: this,
            }
        })
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
  list: {
   flexDirection: 'row',
   flexWrap: 'wrap'
 },
});

module.exports = SelectFont;
