import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.MobClick;

/**
 * 友盟统计模块
 * @module MobClick
 */
var MobClick = {
  beginLogPageView: function(pageName) {
    ExtensionModule.beginLogPageView(pageName);
  },
  endLogPageView: function(pageName) {
    ExtensionModule.endLogPageView(pageName);
  }
}

module.exports = MobClick;
