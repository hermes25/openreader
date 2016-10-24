import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Feedback;

/**
 * 反馈插件模块
 * @module Feedback
 */
var Feedback = {
  /**
   * 弹出反馈对话框
   * @method present
   */
  present : function() {
      ExtensionModule.present();
  }
}

module.exports = Feedback;
