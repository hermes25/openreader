import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.JSContext;

/**
 * javascript引擎
 * @module JSContext
 */
var JSContext = {
    /**
     * 初始化javascript引擎
     */
    initJSContext: function() {
    	ExtensionModule.initJSContext();
    },
    /**
     * 执行javascript脚本
     * @param {String} string 要执行的脚本
     */
    evaluateScript: function(string) {
      ExtensionModule.evaluateScript(string);
    },
    /**
     * 返回javascript对象
     */
    toObject: async function(string) {
      return await ExtensionModule.toObject(string);
    },
    /**
     * 返回字典对象
     */
    toDirectory: function(string) {
      return ExtensionModule.toDirectory(string);
    },
    /**
     * 返回数组对象
     */
    toArray: function(string) {
      return ExtensionModule.toArray(string);
    },
    /**
     * 返回字符串对象
     */
    toString: function(string) {
      return ExtensionModule.toString(string);
    },
    /**
     * 调用Javascript方法
     * @param {String} string 要调用的方法名称
     * @param {String} array 要传入的参数
     */
    call: function(string, array) {
      return ExtensionModule.call(string, array);
    }
}

module.exports = JSContext;
