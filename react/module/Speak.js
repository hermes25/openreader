import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Speak;

/**
 * 语音朗读模块
 * @module Sms
 */
var Speak = {
  /**
   * 加载语音朗读引擎
   * @param {int} pitch 音高
   * @param {int} speed 语速
   * @param {int} sex 性别  1、男声  2、女声
   */
  loadTTS: function(pitch, speed, sex) {
      ExtensionModule.loadTTS(pitch, speed, sex);
  },
  /**
   * 朗读文字内容
   * @param {String} text 朗读的内容
   */
  play: function(text) {
    ExtensionModule.play(text);
  },
  /**
   * 停止朗读
   * @param {String} text 朗读的内容
   */
  stop: function() {
    ExtensionModule.stop();
  },
  /**
   * 恢复朗读
   */
  resume: function() {
    ExtensionModule.resume();
  },
  /**
   * 调整语速
   * @param {int} speed 朗读的语速
   */
  adjustSpeed: function(speed) {
    ExtensionModule.adjustSpeed(speed);
  },
  /**
   * 调整音高
   * @param {int} pitch 朗读时的音高
   */
  adjustPitch: function(pitch) {
    ExtensionModule.adjustPitch(pitch);
  },
  /**
   * 选择男声朗读
   */
  selectMale: function() {
    ExtensionModule.selectMale();
  },
  /**
   * 选择女声朗读
   */
  selectFemale: function() {
    ExtensionModule.selectFemale();
  },
  addListener: (callback) => {
    return DeviceEventEmitter.addListener('speakEnd', callback);
  }
}

module.exports = Speak;
