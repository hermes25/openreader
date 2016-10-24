import React, {
    requireNativeComponent
} from 'react-native';

/**
 * 自定义标签控件
 * 例如：<Label content={{
 *   'fontFile':'', 字体文件路径
 *   'fontSize':35, 字体大小
 *   'fontColor':processColor('rgb(154, 154, 154)'),  字体颜色
 *   'text':'阅'  标签内容
 *  }}></Label>
 * @module Label
 * @param {Json} content 标签内容及样式
 */
var Label = requireNativeComponent('RCTLabel', null);

module.exports = Label;
