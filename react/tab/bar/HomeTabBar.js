import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const HomeTabBar = React.createClass({
  tabIcons: [],
  propTypes: {
      goToPage: React.PropTypes.func,
      activeTab: React.PropTypes.number,
      tabs: React.PropTypes.array,
  },
  componentDidMount() {
    this.setAnimationValue({ value: this.props.activeTab, });
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },
  render() {
    const tabWidth = this.props.containerWidth / this.props.tabs.length;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0, tabWidth, ],
    });

    return <View>
      <View style={[styles.tabs, this.props.style, ]}>
          <TouchableOpacity onPress={() => this.props.goToPage(0)} style={styles.tab}>
              <Icon
                name={'ios-compass'}
                size={24}
                color={this.props.activeTab == 0 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}
              />
              <Text style={[styles.text,{color: this.props.activeTab == 0 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>发现</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.goToPage(1)} style={styles.tab}>
              <Icon
                name={'ios-home'}
                size={24}
                color={this.props.activeTab == 1 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}
              />
              <Text style={[styles.text,{color: this.props.activeTab == 1 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>收藏</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.goToPage(2)} style={styles.tab}>
              <Icon
                name={'md-settings'}
                size={24}
                color={this.props.activeTab == 2 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}
              />
              <Text style={[styles.text,{color: this.props.activeTab == 2 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>设置</Text>
          </TouchableOpacity>
      </View>
    </View>;
  },
  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },
});

const styles = StyleSheet.create({
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
});

export default HomeTabBar;
