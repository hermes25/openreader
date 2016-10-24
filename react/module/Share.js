import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Share;

/**
 * 分享控件模块
 * @module Package
 */
var Share = {
  /**
   * 弹出分享控件
   * @param {String} text 分享的文字内容
   * @param {String[]} images 分享的图片链接
   * @param {String} url 分享的链接地址
   * @param {String} title 分享的标题
   */
  share: function(text, images, url, title) {
      ExtensionModule.share(text, images, url, title);
  }
}

module.exports = Share;
