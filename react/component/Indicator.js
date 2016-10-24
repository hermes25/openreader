import Spinner from 'react-native-spinkit';
import TimerMixin from 'react-timer-mixin';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Dimensions,
    View
} from 'react-native';

var Indicator = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function(){
        return {
            isVisible:false,
            type: 'Wave',
            message: ''
        }
  },
  render: function() {
    if (!this.state.isVisible) return <View/>;
    return (
       <View style={styles.container}>
          <View style={styles.background}>
              {
                this.state.type == ''?null:<Spinner style={styles.spinner} type={this.state.type} color={"#FFFFFF"}/>
              }
              <Text style={[styles.message, {marginTop: this.state.type == '' ? 0 : 15}]}>
                  {this.state.message}
              </Text>
          </View>
       </View>
     );
  },
  show: function(message, type) {
    this.setState({
      isVisible: true,
      type: type,
      message: message,
    });
  },
  showWithTime: function(message, type, time) {
    var _this = this;
    this.setState({
      isVisible: true,
      type: type,
      message: message,
    });
    this.setTimeout(
      () => {_this.setState({isVisible: false}) },
      time
    );
  },
  hide: function() {
    this.setState({
      isVisible: false
    });
  },
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  background:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10
  },
  spinner: {
    marginTop: 10
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

module.exports = Indicator;
