import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  PixelRatio,
} from 'react-native';

const DirectoryTabBar = React.createClass({
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
    const tabWidth = this.props.containerWidth / 5;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0, tabWidth, ],
    });

    return <View style={{backgroundColor:'rgb(240, 240, 240)'}}>
              <View style={[styles.tabs, this.props.style, ]}>
                  <View style={{flex:1}}></View>
                  <TouchableOpacity onPress={() => this.props.goToPage(1)} style={styles.tab}>
                      <Text style={[styles.text,{color: this.props.activeTab == 1 ? 'rgb(254, 96, 77)' : 'rgb(96, 96, 96)'}]}>目录</Text>
                  </TouchableOpacity>
                  <View style={{flex:1}}></View>
                  <TouchableOpacity onPress={() => this.props.goToPage(3)} style={styles.tab}>
                      <Text style={[styles.text,{color: this.props.activeTab == 3 ? 'rgb(254, 96, 77)' : 'rgb(96, 96, 96)'}]}>书签</Text>
                  </TouchableOpacity>
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
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height:50,
    flexDirection: 'row',
    borderBottomWidth: 2/PixelRatio.get(),
    borderBottomColor:'rgba(0,0,0,0.1)',
  },
    text: {
        color:'rgb(86, 86, 86)',
        fontSize: 14,
    },
    tabUnderlineStyle: {
        position: 'absolute',
        height: 3,
        backgroundColor: 'rgb(252, 98, 77)',
        bottom: 0,
    },
});

export default DirectoryTabBar;
