import ScrollableTabView from 'react-native-scrollable-tab-view';
import MobClick from '../module/MobClick.js';
import FavoriteTabView from '../tab/view/FavoriteTabView.js';
import DiscoverTabView from '../tab/view/DiscoverTabView.js';
import SetTabView from '../tab/view/SetTabView.js';
import HomeTabBar from '../tab/bar/HomeTabBar.js';
import StoreBook from '../utils/StoreBook.js';
var UserDefaults = require('react-native-userdefaults-ios');

import React, {
    AsyncStorage,
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    StatusBar,
    Dimensions,
    Navigator,
    TouchableOpacity,
    Animated,
    View,
    Fetch,
    LayoutAnimation
} from 'react-native';

var Home = React.createClass({
    getInitialState: function(){
          return {
            leftPanel: new Animated.Value(0),
            showField:false,
            searchField: 'title',
          }
    },
    componentWillMount () {
          var _this = this;

          MobClick.beginLogPageView('home');

          UserDefaults.stringForKey('shareFile').then(url => {
                if(url != null) {
                  url = 'http://' + url;
                  fetch(url)
                  .then(function(res) {
                    if (res.ok) {
                      UserDefaults.stringForKey('shareKey').then(adkey => {
                          if(adkey != null) {
                            AsyncStorage.getItem("shareAdKeys").then((value) => {
                                if(value == null) {
                                    var keyJson = new Object();
                                    keyJson[url] = adkey;

                                    AsyncStorage.setItem("shareAdKeys", JSON.stringify(keyJson)).done();
                                } else {
                                    var keyJson = JSON.parse(value);
                                    keyJson[url] = adkey;

                                    AsyncStorage.setItem("shareAdKeys", JSON.stringify(keyJson)).done();
                                }
                            }).done();

                            UserDefaults.arrayForKey('adkeys').then(result => {
                              if(result.indexOf(adkey) == -1) {
                                  result.push(adkey);

                                  UserDefaults.setArrayForKey(result, 'adkeys')
                                  .then(result => {});
                              }
                            });
                          }
                      });

                      UserDefaults.removeItemForKey('shareKey').done();
                      UserDefaults.removeItemForKey('shareFile').done();

                      var storeBook = new StoreBook();
                      storeBook.store(_this, url, res);
                    } else {
                      console.log("Looks like the response wasn't perfect, got status", res.status);
                    }
                  });
                }
          });
    },
    componentWillUnmount() {
        MobClick.endLogPageView('home');
    },
    render() {
        const tabWidth = Dimensions.get('window').width;
        const left = this.state.leftPanel.interpolate({
            inputRange: [0, 1, ], outputRange: [0, tabWidth-200, ],
        });
        return (
            <View style={styles.container}>
                  <StatusBar
                      barStyle="default"
                  />
                  <ScrollableTabView onChangeTab={(o) => {
                    if(o.i == 1) {
                      this.refs.favorite.refresh();
                    }
                  }} initialPage={0} renderTabBar={() => <HomeTabBar />} locked={true} style={{backgroundColor:'#FFF'}} tabBarBackgroundColor="white" showsVerticalScrollIndicator={false} tabBarUnderlineColor="#FFFFFF" tabBarPosition="bottom">
                      <View style={styles.tabView}>
                          <DiscoverTabView ref={'discover'} navigator={this.props.navigator} showField={() => this.showField()}/>
                      </View>
                      <View style={styles.tabView}>
                          <FavoriteTabView ref={'favorite'} navigator={this.props.navigator} indexJs={this.props.indexJs}/>
                      </View>
                      <View style={styles.tabView}>
                          <SetTabView navigator={this.props.navigator} />
                      </View>
                  </ScrollableTabView>
        </View>
    );
  },
  setField(field) {
      this.showField();
      this.refs.discover.setSearchField(field);
      this.setState({
          searchField: field
      });
  },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabView: {
        flex: 1,
        backgroundColor:'rgb(250, 250, 250)'
    },
    home: {
      position: 'absolute',
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 0
      }
    },
    top: {
        marginTop: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth:1,
        borderColor:'#EEE',
    },
    titleText: {
        fontSize: 16,
    },
    mask: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor:'rgba(0, 0, 0, 0)',
        width:200,
        height:Dimensions.get('window').height,
    },
});

module.exports = Home;
