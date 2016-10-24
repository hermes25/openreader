import Icon from 'react-native-vector-icons/Ionicons';
import MobClick from '../module/MobClick.js';
import Indicator from '../component/Indicator.js';
import StoreBook from '../utils/StoreBook.js';
import Feedback from '../module/Feedback.js';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Image,
    View
} from 'react-native';

var Detail = React.createClass ({
    getInitialState() {
        return {
            showSearch: false,
            showCategory: true,
            searchField: 'title',
            searchFieldText: '搜标题'
        }
    },
    componentWillMount() {
        MobClick.beginLogPageView('detail');
    },
    componentWillUnmount() {
        MobClick.endLogPageView('detail');
    },
    render() {
        var tagArray = this.props.data.tag.split(',');

        var tags = [];

        for(var i=0;i<tagArray.length;i++){
            tags[i] = {
              tag:tagArray[i],
              color:this.getColor(i)
            }
        }

        return (
            <View style={styles.container}>
            <StatusBar
                barStyle="default"
            />
                <View style={styles.topBar}>
                    <View style={styles.toolsBar}>
                        <TouchableOpacity style={styles.topLeft} onPress={this.pressBack}>
                                <Icon
                                  name={'ios-arrow-back'}
                                  size={30}
                                  color={'rgb(153, 153, 153)'}
                                  style={styles.categoryIcon}
                                />
                        </TouchableOpacity>
                        <View style={styles.topMiddle}>
                            <Text style={styles.subject}>
                                  内容详情
                            </Text>
                        </View>
                        <View style={styles.topRight}>
                            <TouchableOpacity onPress={this.pressFeedback}>
                                <Text style={styles.feedback}>反馈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.detail}>
                      <View style={styles.row1}>
                          <View style={styles.cover}>
                              <Image style={styles.image}
                                     source={{uri:this.props.data.cover}}
                                     resizeMode="contain"/>
                          </View>
                          <View style={styles.detail}>
                              <Text style={styles.name} numberOfLines={1}>{this.props.data.name}</Text>
                              <View style={{flexDirection:'row'}}>
                                  <Text style={styles.author} numberOfLines={1}>{this.props.data.author}</Text>
                                  <Text style={styles.url} numberOfLines={1}>| {this.props.data.last}</Text>
                              </View>
                              <Text style={styles.last} numberOfLines={1}>{this.props.data.url}</Text>
                          </View>
                      </View>
                      <View style={styles.row2}>
                          <TouchableOpacity style={styles.favoriteBtn} onPress={this.pressFavorite}>
                              <Text style={styles.favText}> + 收藏</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.readBtn} onPress={this.pressBrowse}>
                              <Text style={styles.readText}>在线阅读</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.line}>
                      </View>
                      <View style={styles.plugins}>
                          <View style={styles.communication}>
                              <Text style={[{fontSize:12,color:'#888'}]}>互动交流</Text>
                              <Text style={[{fontSize:14,marginTop: 10}]}>支持</Text>
                          </View>
                          <View style={styles.reward}>
                              <Text style={[{fontSize:12,color:'#888'}]}>内容打赏</Text>
                              <Text style={[{fontSize:14,marginTop: 10}]}>支持</Text>
                          </View>
                          <View style={styles.ad}>
                              <Text style={[{fontSize:12,color:'#888'}]}>内置广告</Text>
                              <Text style={[{fontSize:14,marginTop: 10}]}>支持</Text>
                          </View>
                      </View>
                      <View style={[styles.line, {marginTop: 10}]}>
                      </View>
                      <View style={styles.tags}>
                          {tags.map((tag, i) => {
                              return <View key={tag.tag} style={[styles.tag, {backgroundColor:tag.color}]}>
                                  <Text style={styles.tagText}>{tag.tag}</Text>
                              </View>;
                          })}
                      </View>
                      <View style={[styles.line, {marginTop: 15}]}>
                      </View>
                      <View style={styles.introduce}>
                          <Text style={styles.introduceText}>{this.props.data.intro}</Text>
                      </View>
                </ScrollView>
                <Indicator ref={'indicator'} />
            </View>
        );
    },
    getColor (i) {
      i = i % 6;
      var colors = ['#8cc4ea','#c668d0','#fbbc82','#8aced5','#52cbb7','#ec908f'];
      return colors[i];
    },
    pressBack() {
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.pop();
      }
    },
    pressBrowse() {
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.push({
              id: 'browse',
              data:{
                  url:this.props.data.url,
                  file: 'http://ereader.oss-cn-hangzhou.aliyuncs.com/' + this.props.data.file,
              }
          })
      }
    },
    pressFeedback() {
      Feedback.present();
    },
    pressFavorite() {
      var _this = this;

      var url = 'http://ereader.oss-cn-hangzhou.aliyuncs.com/' + this.props.data.file;

      _this.refs.indicator.show('正在获取内容...', 'Wave');
      fetch(url)
      .then(function(res) {
        if (res.ok) {
          var storeBook = new StoreBook();
          storeBook.store(_this, url, res);
        } else {
          console.log("Looks like the response wasn't perfect, got status", res.status);
        }
      });
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    topBar: {
        flexDirection: 'row',
        height:70,
        backgroundColor:'rgb(255, 255, 255)',
        borderBottomWidth: 1,
        borderBottomColor:'rgba(0,0,0,0.1)'
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
    row1: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
    },
    image: {
        width:60,
        height:70,
        marginTop: 2,
    },
    detail: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    name: {
        fontSize:15,
        marginTop: 2,
    },
    author: {
        fontSize:12,
        marginTop:13,
        color:'rgb(216, 38, 43)',
    },
    url: {
      flex: 1,
      fontSize:11,
      marginTop:13,
      marginLeft: 5,
      marginRight: 10,
      color:'#A5A5A5',
    },
    last: {
        fontSize:12,
        marginTop:10,
        color:'#A5A5A5',
    },
    row2: {
        height: 50,
        flexDirection: 'row',
        marginTop: 5,
    },
    favoriteBtn: {
      flex:1,
      marginTop: 10,
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      borderWidth:1,
      borderColor:'rgb(210, 41, 49)',
      borderRadius: 4,
      marginLeft: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    favText: {
      color: 'rgb(210, 41, 49)',
    },
    readBtn: {
      flex:1,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      backgroundColor:'rgb(210, 41, 49)',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    readText: {
      color: 'rgb(255, 255, 255)',
    },
    line: {
      height:1,
      backgroundColor: 'rgb(244, 244, 244)',
      marginTop: 20,
    },
    communication: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      marginTop: 10,
      marginLeft: 8,
    },
    reward: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      marginTop: 10,
    },
    ad: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      marginTop: 10,
      marginRight: 8,
    },
    plugins: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tags: {
        flex:1,
        flexDirection: 'row',
        marginLeft:5,
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tag: {
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        paddingTop:8,
        paddingRight:15,
        paddingBottom:8,
        paddingLeft:15,
        borderRadius: 3,
    },
    tagText: {
        fontSize: 13,
        color: '#FFF'
    },
    introduce: {
        marginTop: 10,
        padding: 5,
    },
    introduceText: {
        fontSize: 13,
        color: '#222'
    },
    feedback: {
        color: 'rgb(252, 98, 77)',
    }
});

export default Detail;
