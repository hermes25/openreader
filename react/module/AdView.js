import React, {
    requireNativeComponent
} from 'react-native';

/**
 * 广告视图控件
 * 例如：<AdView content={"SDK12345678"}></AdView>
 * @module AdView
 * @param {String} content AdView的广告标识
 */

var AdView = requireNativeComponent('RCTAdView', null);

module.exports = AdView;
