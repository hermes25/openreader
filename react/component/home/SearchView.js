import DiscoverItem from './DiscoverItem.js';
import Cryptor from '../../module/Cryptor.js';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    ListView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    View
} from 'react-native';

import RefreshInfiniteListView from '../../component/RefreshInfiniteListView.js';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var SearchView = React.createClass ({
      data: {key: '', no: 0, size:5, total: 0, field: '', list:[]},
      getInitialState() {
          this.data.key = '';
          this.data.no = 0;
          this.data.size = 5;
          this.data.total = 0;
          this.data.field = '';
          this.data.list = [];

          return {
              failed: false,
              searching: false,
              dataSource: ds.cloneWithRows(this.data.list)
          }
      },
      renderRow(item) {
          return (
              <View style={styles.item}>
                  <TouchableOpacity onPress={() => this.pressDetail(item)}>
                      <DiscoverItem item={item}/>
                  </TouchableOpacity>
              </View>
          )
      },
      render() {
          var searchView = null;

          if(this.state.searching) {
            searchView = <View style={{height:50, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                          <ActivityIndicatorIOS
                                  size='small'
                                  animating={true}/>
                          <Text style={{marginLeft: 10, color:'rgb(198,198,198)'}}>
                              搜索中...
                          </Text>
                          </View>;
          } else {
            if(this.state.failed) {
               searchView = <View style={{height:Dimensions.get('window').height*2/3, justifyContent:'center',alignItems:'center'}}>
                                 <Text style={{fontSize:15, fontWeight:'300', color:'gray'}}>
                                       抱歉，没有找到相关的搜索结果
                                 </Text>
                             </View>;
            } else {
                searchView = <RefreshInfiniteListView
                                ref = {(list) => {this.list= list}}
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow}
                                renderSeparator={this.renderSeparator}
                                initialListSize={30}
                                scrollEventThrottle={10}
                                style={styles.container}
                                onInfinite = {this.onInfinite}
                                enableRefresh = {false}
                                enableInfinite = {true}
                                >
                            </RefreshInfiniteListView>
            }
          }

          return (
            <View style={styles.container}>
              {searchView}
            </View>
          )
      },
      pressDetail(item) {
            const navigator = this.props.navigator;

            if(navigator) {
                navigator.push({
                    id: 'detail',
                    data: item
                  });
            }
      },
      async searchEvent(first, text, field) {
        this.setState({
          searching: true,
        })

        this.data.field = field;
        this.data.key = text;
        this.state.failed = false;

        if(first) {
          this.data.no = 0;
          this.data.total = 0;
          this.data.list = [];
        } else {
            this.data.no = this.data.no + this.data.size;
        }

        var _this = this;

        var searchUrl = await Cryptor.url(this.data.no, this.data.size, this.data.field, this.data.key);

        fetch(searchUrl)
        .then(function(res){
          if (res.ok) {
            res.json().then(function(resData) {
                if(_this.list != null) {
                    _this.list.hideHeader();
                }

                for(var i=0;i<resData.result.items.length;i++) {
                    _this.data.list[_this.data.list.length] = resData.result.items[i];
                }

                if (_this.data.list.length <= 0) {
                  _this.setState({failed: true});
                } else {
                  _this.setState({dataSource: ds.cloneWithRows(_this.data.list)});
                }
            })
          } else {
            console.log("Looks like the response wasn't perfect, got status", res.status);
          }

          _this.setState({
            searching: false,
          })
        });
      },
      onInfinite() {
        this.searchEvent(false, this.data.key, this.data.field);
      },
});

const styles = StyleSheet.create({
    container: {
      height:Dimensions.get('window').height-120,
      backgroundColor:'#FFF'
    },
    item: {
        backgroundColor:'#FFF',
        padding: 10,
        borderBottomWidth:1/PixelRatio.get(),
        borderBottomColor:'rgb(233, 234, 236)',
    },
    list: {
        alignSelf:'stretch'
    },
    separator: {
        height: 1,
        backgroundColor: '#CCC'
    }
});

export default SearchView;
