var { NativeModules, DeviceEventEmitter } = require('react-native');
var {DeviceBattery} = NativeModules;

/**
 * 电池信息模块
 */
export default {
  getBatteryLevel: DeviceBattery.getBatteryLevel,
  addListener: (callback) => {
    return DeviceEventEmitter.addListener('batteryChange', callback);
  }
};
