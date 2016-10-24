import {
  NativeModules
} from 'react-native';

var ExtensionModule = NativeModules.Package;

/**
 * 软件包(jsbundle) 管理模块
 * @module Package
 */
var Package = {
  /**
   * 实时重载整个软件包
   */
  reload: function() {
    ExtensionModule.reload();
  }
}

module.exports = Package;
