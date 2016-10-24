import {
  NativeModules,
  DeviceEventEmitter
} from 'react-native';

var ExtensionModule = NativeModules.Voice;

/**
 * 语音识别模块
 * @module Voice
 */
var Voice = {
  /**
   * 初始化语音识别引擎
   */
  loadVoice: function() {
      ExtensionModule.loadVoice();
  },
  /**
   * 启动语音识别引擎
   */
  start: function() {
    ExtensionModule.start();
  },
  /**
   * 停止语音识别引擎
   */
  stop: function() {
    ExtensionModule.stop();
  },
  addListener: (callback) => {
    return DeviceEventEmitter.addListener('onToast', callback);
  }
}

module.exports = Voice;
