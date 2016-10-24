import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Server;

/**
 * Web服务器 (字体上传)
 * @module Server
 */
var Server = {
  /**
   * 启动服务器
   */
  start: async function() {
    var result = await ExtensionModule.start();
    return result;
  },
  /**
   * 停止服务器
   */
  stop: function() {
     ExtensionModule.stop();
  }
}

module.exports = Server;
