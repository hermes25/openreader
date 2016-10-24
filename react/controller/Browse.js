import Icon from 'react-native-vector-icons/Ionicons';
import MobClick from '../module/MobClick.js';
import StoreBook from '../utils/StoreBook.js';
import Indicator from '../component/Indicator.js';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    WebView,
    View
} from 'react-native';

class Browse extends Component {
    constructor(props) {
        super(props);
        this.state = {
          backButtonEnabled: false,
          forwardButtonEnabled: false,
          loading: true,
        };
    }

    componentWillMount() {
        MobClick.beginLogPageView('browse');
    }

    componentWillUnmount() {
        MobClick.endLogPageView('browse');
    }

    render() {
        return (
            <View style={styles.container}>
              <StatusBar
                  barStyle="default"
              />
              <View>
                  <View style={{height:25,backgroundColor:'#FFF'}}></View>
                  <View style={styles.webView}>
                  <WebView
                  ref={'webView'}
                  style={{flex:1}}
                  source={{uri: this.props.data.url}}
                  javaScriptEnabled={true}
                  startInLoadingState={true}
                  onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                  />
                  </View>
                  <View style={[styles.tabs, this.props.style, ]}>
                      <TouchableOpacity onPress={() => this.refs.webView.goBack()} style={styles.tab}>
                          <Icon
                            name={'ios-arrow-back'}
                            size={24}
                            color={this.state.backButtonEnabled ? 'rgb(100, 100, 100)' : 'rgb(179, 179, 179)'}
                          />
                          <Text style={[styles.text,{color: this.state.backButtonEnabled ? 'rgb(100, 100, 100)' : 'rgb(179, 179, 179)'}]}>后退</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.refs.webView.goForward()} style={styles.tab}>
                          <Icon
                            name={'ios-arrow-forward'}
                            size={24}
                            color={this.state.forwardButtonEnabled ? 'rgb(100, 100, 100)' : 'rgb(179, 179, 179)'}
                          />
                          <Text style={[styles.text,{color: this.state.forwardButtonEnabled ? 'rgb(100, 100, 100)' : 'rgb(179, 179, 179)'}]}>前进</Text>
                      </TouchableOpacity>
                      {this.state.loading?<TouchableOpacity onPress={() => this.refs.webView.reload()} style={styles.tab}>
                          <Icon
                            name={'md-close'}
                            size={24}
                            color={this.props.activeTab == 2 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}
                          />
                          <Text style={[styles.text,{color: this.props.activeTab == 2 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>停止</Text>
                      </TouchableOpacity>:
                        <TouchableOpacity onPress={() => this.refs.webView.reload()} style={styles.tab}>
                            <Icon
                              name={'md-refresh'}
                              size={24}
                              color={'rgb(179, 179, 179)'}
                            />
                            <Text style={[styles.text,{color: 'rgb(179, 179, 179)'}]}>刷新</Text>
                        </TouchableOpacity>
                      }
                      <TouchableOpacity onPress={() => this.pressFavorite()} style={styles.tab}>
                          <Icon
                            name={'md-star'}
                            size={24}
                            color={'rgb(254, 96, 77)'}
                          />
                          <Text style={[styles.text,{color: 'rgb(254, 96, 77)'}]}>收藏</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.pressBack()} style={styles.tab}>
                          <Icon
                            name={'md-exit'}
                            size={24}
                            color={'rgb(179, 179, 179)'}
                          />
                          <Text style={[styles.text,{color : 'rgb(179, 179, 179)'}]}>退出</Text>
                      </TouchableOpacity>
                  </View>
              </View>
              <Indicator ref={'indicator'} />
            </View>
        );
    }
    pressBack() {
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.pop();
      }
    }
    pressFavorite() {
      var _this = this;

      var url = this.props.data.file;

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
    }
    onNavigationStateChange (navState) {
      this.setState({
        backButtonEnabled: navState.canGoBack,
        forwardButtonEnabled: navState.canGoForward,
        loading: navState.loading,
      });
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column'
        },
        tab: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabs: {
          height: 50,
          flexDirection: 'row',
          borderTopWidth: 1,
            borderTopColor:'rgba(0,0,0,0.1)',
        },
        text: {
            fontSize:10,
            color:'rgb(179, 179, 179)',
        },
        webView: {
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height-75,
        }
});

export default Browse;
