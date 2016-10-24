import DiscoverItem from './DiscoverItem.js';
import Swipeout from 'react-native-swipeout';
import BookDAO from '../../dao/BookDAO.js';
import Cryptor from '../../module/Cryptor.js';
import MobClick from '../../module/MobClick.js';

import TimerMixin from 'react-timer-mixin';
import RefreshInfiniteListView from '../RefreshInfiniteListView.js';


import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    ListView,
    TouchableOpacity,
    Image,
    View
} from 'react-native';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var RecommendView = React.createClass ({
      mixins: [TimerMixin],
      data: {no: 0, size:5, total: 0, list:[]},
      getInitialState() {
          this.data.no = 0;
          this.data.size = 5;
          this.data.total = 0;
          this.data.list = [];

          return {
              failed: false,
              dataSource: ds.cloneWithRows(this.data.list)
          }
      },
      componentDidMount() {
           this.searchEvent(true);
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
          return (
            <View style={styles.container}>
            {this.state.failed?
              <View style={{height:Dimensions.get('window').height*2/3, justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:15, fontWeight:'300', color:'gray'}}>
                      抱歉，没有找到相关的搜索结果
                </Text>
            </View>:<RefreshInfiniteListView
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
            </RefreshInfiniteListView>}
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
      async searchEvent(first) {
        this.state.failed = false;

        if(first) {
          this.data.no = 0;
          this.data.total = 0;
          this.data.list = [];
        } else {
            this.data.no = this.data.no + this.data.size;
        }

        var _this = this;

        var searchUrl = await Cryptor.recommend(this.data.no, this.data.size);
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
        });
      },
      onInfinite() {
        this.searchEvent(false, this.data.key);
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
});

export default RecommendView;
