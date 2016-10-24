import FavoriteItem from '../../component/home/FavoriteItem.js';
import Swipeout from 'react-native-swipeout';
import BookDAO from '../../dao/BookDAO.js';
import FavoriteTabBar from '../bar/FavoriteTabBar.js';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RNFS from 'react-native-fs';

var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    ListView,
    TouchableOpacity,
    View
} from 'react-native';

var texts = [];
var images = [];

var FavoriteTabView = React.createClass ({
    bookDao : new BookDAO(),
    getInitialState() {
        var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});

        return {
            selected: null,
            textSource: ds.cloneWithRows(texts),
            imageSource: ds.cloneWithRows(images),
            scrollEnabled: true
        }
    },
    componentWillMount() {
      this.refreshTexts();
      this.refreshImages();
    },
    renderRow: function (rowData) {
      var _this = this;

      var swipeoutBtns = [{
            text:'更新',
            onPress:function(){ _this.pressUpdate() },
      },{
            text: '删除',
            backgroundColor: '#F00',
            onPress: function(){ _this.pressRemove() },
      }];

      return <Swipeout right={swipeoutBtns} backgroundColor="rgb(250, 250, 250)" autoClose={true} onOpen={() => this.handleSwipeout(rowData)}>
                <TouchableOpacity style={styles.item} onPress={() => this.pressRead(rowData)}>
                    <FavoriteItem item={rowData}/>
                </TouchableOpacity>
            </Swipeout>
    },
    render() {
        return (
          <ScrollableTabView initialPage={2} renderTabBar={() => <FavoriteTabBar />} locked={true} style={{backgroundColor:'#FFF'}} tabBarBackgroundColor="white" showsVerticalScrollIndicator={false} tabBarUnderlineColor="#FFFFFF" tabBarPosition="top">
                <View>
                </View>
                <View>
                </View>
                <ListView
                  scrollEnabled={this.state.scrollEnabled}
                  dataSource={this.state.textSource}
                  renderRow={this.renderRow}
                  enableEmptySections={true}/>
                <View>
                </View>
                <ListView
                  scrollEnabled={this.state.scrollEnabled}
                  dataSource={this.state.imageSource}
                  renderRow={this.renderRow}
                  enableEmptySections={true}/>
                <View>
                </View>
                <View>
                </View>
            </ScrollableTabView>
        );
    },
    refresh() {
      this.refreshTexts();
      this.refreshImages();
    },
    refreshTexts() {
      var _this = this;

      this.bookDao.find({
        where:{
          type:1
        }
      }).then(function(data){
        texts = data;

        if(texts == null) {
            texts = [];
        }

        _this.setState({
          textSource: _this.state.textSource.cloneWithRows(texts)
        })
      });
    },
    refreshImages() {
      var _this = this;

      this.bookDao.find({
        where:{
          type:2
        }
      }).then(function(data){
        images = data;

        if(images == null) {
            images = [];
        }

        _this.setState({
          imageSource:_this.state.imageSource.cloneWithRows(images)
        });
      });
    },
    async pressUpdate() {
        this.state.selected.state = 3;
        await this.bookDao.updateById(this.state.selected, this.state.selected._id);

        if(this.state.selected.type == 1){
            this.refreshTexts();
        } else if(this.state.selected.type == 2) {
            this.refreshImages();
        }

        this.props.indexJs.updateDirectory();
    },
    async pressRemove() {
      var folderPath = RNFS.DocumentDirectoryPath + '/' + this.state.selected.code;
      RNFS.readDir(folderPath)
        .then(async (result) => {
            if(this.state.selected.plugins != null && this.state.selected.plugins.ad != null) {
              UserDefaults.arrayForKey('adkeys').then(result => {
                var index = result.indexOf(this.state.selected.plugins.ad);

                if(index != -1) {
                    result.splice(index, 1);
                }

                UserDefaults.setArrayForKey(result, 'adkeys')
                  .then(result => {});
                });
            }

            for(var i=0;i < result.length; i++) {
              RNFS.unlink(result[i].path);
            }
            await this.bookDao.removeById(this.state.selected._id);
            if(this.state.selected.type == 1) {
                this.refreshTexts();
            } else if (this.state.selected.type == 2) {
                this.refreshImages();
            }
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
    },
    handleSwipeout(item) {
        this.setState({
          selected: item
        });
    },
    pressRead(data) {
      const navigator = this.props.navigator;
      if(navigator) {
          if (data.type == 1) {
            navigator.push({
                id: 'rtext',
                data:{
                    id:data._id,
                }
            })
          } else if (data.type == 2) {
            navigator.push({
                id: 'rimage',
                data:{
                    id:data._id,
                }
            })
          }
      }
    },
});

const styles = StyleSheet.create({
    container: {
      height:Dimensions.get('window').height-120
    },
    item: {
        backgroundColor:'#FFF',
        padding: 10,
        borderBottomWidth:1/PixelRatio.get(),
        borderBottomColor:'rgb(233, 234, 236)',
    }
});

export default FavoriteTabView;
