import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Cryptor;

/**
 * 加密解密模块
 * @module Cryptor
 */
var Cryptor = {
    /**
     * 内容解密
     * @method decryptor
     * @param {String} string 想要解密的内容
     * @param {Function} handler 解密后内容传入的方法
     */
    decryptor: function(string, handler: Function) {
    	ExtensionModule.decryptor(string, handler);
    },
    /**
     * 获得加密后的搜索请求路径
     * @method url
     * @param {int} pageNo 页码
     * @param {int} pageSize 单页结果数量
     * @param {String} field 想要查询的字段
     * @param {String} keywords 想要查询的关键词
     * @return {String} 加密后的url路径
     */
    url: async function(pageNo, pageSize, field, keywords) {
      return await ExtensionModule.url(pageNo, pageSize, field, keywords);
    },
    /**
     * 获得加密后的推荐请求路径
     * @method recommend
     * @param {int} pageNo 页码
     * @param {int} pageSize 单页结果数量
     * @return {String} 加密后的url路径
     */
    recommend: async function(pageNo, pageSize) {
      return await ExtensionModule.recommend(pageNo, pageSize);
    }
}

module.exports = Cryptor;
