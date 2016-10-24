import Icon from 'react-native-vector-icons/Ionicons';

import Indicator from '../../component/Indicator.js'
import StoreBook from '../../utils/StoreBook.js';
import RecommendView from '../../component/home/RecommendView.js';
import SearchView from '../../component/home/SearchView.js';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    PixelRatio,
    TextInput,
    TouchableOpacity,
    Dimensions,
    View
} from 'react-native';

var DiscoverTabView = React.createClass ({
    getInitialState() {
        return {
            showSearch: false,
            showTip: false,
            searchField: 'name',
            searchFieldText: '',
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                      <View style={styles.searchBar}>
                          <View style={styles.searchBorder}>
                              <Icon
                                name={'ios-search'}
                                size={16}
                                color={'rgb(179, 179, 179)'}
                                style={styles.categoryIcon}
                              />
                              <TextInput ref={'searchInput'} style={styles.searchInput} returnKeyType="search" placeholder="搜你想搜，读你想读" clearButtonMode="while-editing" value={this.state.searchFieldText} onChangeText={(text) => {this.changeSearch(text)}} onSubmitEditing={this.searchAction}/>
                          </View>
                      </View>
                      <View style={styles.qrscanner}>
                              <TouchableOpacity onPress={this.pressQr}>
                                  <Icon
                                    name={'ios-camera-outline'}
                                    size={30}
                                    color={'rgb(252, 98, 77)'}
                                    style={styles.categoryIcon}
                                  />
                            </TouchableOpacity>
                      </View>
                </View>
                {this.state.showSearch?
                  <SearchView navigator={this.props.navigator} ref={'search'} />:<RecommendView navigator={this.props.navigator} ref={'recommend'}/>
                }
                {this.state.showTip?
                  <View style={styles.tipBar}>
                      <TouchableOpacity style={styles.tipRow} onPress={() => this.searchWithField('author')}>
                          <Icon
                            name={'ios-person-outline'}
                            size={30}
                            color={'rgb(208, 208, 208)'}
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.tipText}>在作者中搜索</Text>
                          <Text style={styles.tipKeywords}>{this.state.searchFieldText}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.tipRow} onPress={() => this.searchWithField('tag')}>
                          <Icon
                            name={'ios-bookmark-outline'}
                            size={26}
                            color={'rgb(208, 208, 208)'}
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.tipText}>在标签中搜索</Text>
                          <Text style={styles.tipKeywords}>{this.state.searchFieldText}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.tipRow} onPress={() => this.searchWithField('last')}>
                          <Icon
                            name={'ios-time-outline'}
                            size={24}
                            color={'rgb(208, 208, 208)'}
                            style={styles.categoryIcon}
                          />
                          <Text style={styles.tipText}>在最新中搜索</Text>
                          <Text style={styles.tipKeywords}>{this.state.searchFieldText}</Text>
                      </TouchableOpacity>
                  </View>:null
                }
                <Indicator ref={'indicator'} />
            </View>
        );
    },
    searchAction(obj) {
        if(obj.nativeEvent.text != '') {
            this.setState({
              showSearch: true,
              showTip: false,
              searchField: 'name',
            });
            this.refs.search.toSearch(true, obj.nativeEvent.text, this.state.searchField);
        } else {
            this.setState({
              showSearch: false,
              showTip: false,
            });
        }
    },
    searchWithField(field) {
        this.setState({
          searchField: field,
          showSearch: true,
          showTip: false,
        });
        this.refs.search.toSearch(true, this.state.searchFieldText, field);
    },
    changeSearch(text){
      this.setState({
        searchFieldText:text,
        showTip: true,
      });
    },
    pressQr(){
      var _this = this;
      const navigator = this.props.navigator;

      if(navigator) {
          navigator.push({
              id: 'qr',
              data: {
                  add: function(url) {
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
              }
          })
      }
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor:'rgb(255, 255, 255)',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 26,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor:'rgba(0,0,0,0.1)'
    },
    category: {
        width: 60,
        alignItems: 'center',
        padding: 8,
        paddingLeft: 35,
        paddingRight: 35,
    },
    categoryText: {
        color: 'rgb(252, 98, 77)',
    },
    categoryIcon: {
        marginLeft: 5,
    },
    searchBar: {
        flex: 1,
        marginLeft: 10,
    },
    searchBorder: {
        backgroundColor:'rgb(250, 250, 250)',
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#ddd',
        borderRadius: 10,
        padding:8,
        flexDirection:'row',
        alignItems:'center'
    },
    searchInput: {
        flex:1,
        backgroundColor:'rgb(250, 250, 250)',
        fontSize:14,
        marginLeft:10,
        paddingTop:2,
    },
    qrscanner: {
        width: 60,
        paddingTop: 1,
        alignItems:'center'
    },
    tipBar: {
      height:Dimensions.get('window').height-120,
      width:Dimensions.get('window').width,
      backgroundColor:'#FFF',
      position:'absolute',
      top: 72,
      left: 0,
      flexDirection: 'column',
    },
    tipRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'rgb(230, 230, 230)',
      alignItems: 'center',
      paddingLeft: 10,
      paddingBottom: 9,
      paddingTop: 9,
    },
    tipText: {
      color:'rgb(208, 208, 208)',
      marginLeft: 10,
      fontSize: 16,
    },
    tipKeywords: {
      color:'rgb(252, 98, 77)',
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
    }
});

export default DiscoverTabView;
