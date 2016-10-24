import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

const FavoriteTabBar = React.createClass({
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
    const tabWidth = this.props.containerWidth / 7;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0, tabWidth, ],
    });

    return <View>
      <View style={[styles.tabs, this.props.style, ]}>
          <View style={{flex:1}}></View>
          <View style={{flex:1}}></View>
          <TouchableOpacity onPress={() => this.props.goToPage(2)} style={styles.tab}>
              <Text style={[styles.text,{color: this.props.activeTab == 2 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>文字</Text>
          </TouchableOpacity>
          <View style={{flex:1}}></View>
          <TouchableOpacity onPress={() => this.props.goToPage(4)} style={styles.tab}>
              <Text style={[styles.text,{color: this.props.activeTab == 4 ? 'rgb(254, 96, 77)' : 'rgb(179, 179, 179)'}]}>图片</Text>
          </TouchableOpacity>
          <View style={{flex:1}}></View>
          <View style={{flex:1}}></View>
      </View>
        <Animated.View style={[styles.tabUnderlineStyle, { width: tabWidth }, { left, }, ]} />
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
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height:70,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor:'rgba(0,0,0,0.1)',
  },
    text: {
        color:'rgb(86, 86, 86)',
        fontSize: 16,
    },
    tabUnderlineStyle: {
        position: 'absolute',
        height: 3,
        backgroundColor: 'rgb(252, 98, 77)',
        bottom: 0,
    },
});

export default FavoriteTabBar;
