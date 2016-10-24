import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Sms;

/**
 * 短信验证码模块
 * @module Sms
 */
var Sms = {
  /**
   * 验证短信验证码
   * @param {String} code 验证码
   * @param {String} phone 手机号码
   * @param {String} type 自定义验证码类型
   */
  verificationCode: function(code, phone, type) {
      ExtensionModule.verificationCode(code, phone, type);
  },
  /**
   * 下发短信验证码
   * @param {String} phone 手机号码
   * @param {String} type 自定义验证码类型
   */
  getVerificationCode: function(phone, type) {
      ExtensionModule.getVerificationCode(phone, type);
  },
  /**
   * 登录
   * @param {String} nickname 登录账号
   * @param {String} phone 手机号码
   * @param {String} password 登录密码
   */
  login: function(account, phone, password) {
      ExtensionModule.login(account, phone, password);
  },
  /**
   * 注册账号
   * @param {String} nickname 登录账号
   * @param {String} phone 手机号码
   * @param {String} password 登录密码
   */
  register: function(nickname, phone, password) {
      ExtensionModule.register(nickname, phone, password);
  },
  /**
   * 忘记密码
   * @param {String} nickname 登录账号
   * @param {String} password 新密码
   */
  forgot: function(phone, password) {
      ExtensionModule.forgot(phone, password);
  },
  addListener: (callback) => {
    return DeviceEventEmitter.addListener('onResult', callback);
  }
}

module.exports = Sms;
