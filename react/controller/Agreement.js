import Icon from 'react-native-vector-icons/Ionicons';
import MobClick from '../module/MobClick.js';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    WebView,
    View
} from 'react-native';

class Agreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
          statusBar: false,
        };
    }

    componentWillMount() {
        MobClick.beginLogPageView('home');
    }

    componentWillUnmount() {
        MobClick.endLogPageView('home');
    }

    render() {
        return (
            <View style={styles.container}>
              <StatusBar
                  barStyle="default"
                  showHideTransition={'slide'}
                  hidden={this.state.statusBar}
                  animated
                  translucent
              />
                  <View style={styles.topBar}>
                        <TouchableOpacity style={styles.tlBar} onPress={() => this.pressBack()}>
                            <Icon
                              name={'ios-arrow-back'}
                              size={30}
                              color={'rgba(0, 0, 0, 0.9)'}
                            />
                        </TouchableOpacity>
                        <View style={styles.tmBar}>
                              <Text style={styles.subject}>服务条款</Text>
                        </View>
                        <View style={styles.trBar}>

                        </View>
                  </View>
                  <WebView
                    ref={'webView'}
                    style={{flex:1}}
                    source={require('../resources/agreement.html')}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
                    />
            </View>
        );
    }

    pressBack() {
      const navigator = this.props.navigator;
      if(navigator) {
          navigator.pop();
      }
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column'
        },
        topBar: {
            flexDirection: 'row',
            backgroundColor:'rgb(255, 255, 255)',
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 26,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor:'rgba(0,0,0,0.1)',
            height: 70,
            alignItems: 'center',
        },
        tlBar: {
            width: 50,
            alignItems: 'center',
        },
        tmBar: {
            flex: 1,
            alignItems: 'center',
        },
        trBar: {
            width: 50,
            alignItems: 'center',
        },
        subject: {
            fontSize: 18,
            color: 'rgb(90, 90, 90)'
        },
});

export default Agreement;
