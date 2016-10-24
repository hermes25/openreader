import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.TextStorage;

/**
 * 文字内容分页模块
 * @module TextStorage
 */
var TextStorage = {
  /**
   * 初始化分页
   * @param {String} string 文字内容
   * @param {int} width 容器宽度
   * @param {int} height 容器高度
   * @param {int} left 内容左边距
   * @param {int} top 内容顶部边距
   * @param {int} lineSpacing 内容行间距
   * @param {int} paragraphSpacing 内容段落间距
   * @param {String} fontName 字体名称
   * @param {String} fontSize 字体大小
   * @param {int} adHeight 广告高度
   * @param {int} scale 手机缩放倍率
   */
  init: function(string, width, height, left, top, lineSpacing, paragraphSpacing, fontName, fontSize, adHeight, scale) {
      ExtensionModule.init(string, width, height, left, top, lineSpacing, paragraphSpacing, fontName, fontSize, adHeight, scale);
  },
  /**
   * 获得指定页码文字
   * @param {int} pageNo 页码
   */
  getPage: async function(pageNo) {
    var result = await ExtensionModule.getPage(pageNo);
    return result;
  },
  /**
   * 获得总页数
   */
  getTotal: async function() {
    var result = await ExtensionModule.getTotal();
    return result;
  }
}

module.exports = TextStorage;
