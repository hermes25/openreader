import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';

/**
 * 搜索结果单行布局
 * 例如：<DiscoverItem item={item}/>
 * @module DiscoverItem
 * @param {String} item.cover 内容封面
 * @param {String} item.name 内容名称
 * @param {String} item.name 内容作者
 * @param {String} item.name 内容介绍
 * @param {String} item.name 内容最新更新
 */
class DiscoverItem extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.cover}>
                    <Image style={styles.image}
                           source={{uri:this.props.item.cover}}
                           resizeMode="contain"/>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.name} numberOfLines={3}>{this.props.item.name}</Text>
                    <Text style={styles.author} numberOfLines={1}>{this.props.item.author}</Text>
                    <Text style={styles.intro} numberOfLines={2}>{this.props.item.intro}</Text>
                    <Text style={styles.last} numberOfLines={1}>{this.props.item.last}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    image: {
        width:84,
        height:98,
    },
    detail: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize:15,
        marginTop: 5,
    },
    author: {
        fontSize:13,
        color:'#A5A5A5',
        marginTop: 5,
    },
    last: {
        fontSize:13,
        color:'#A5A5A5',
        marginTop: 5,
    },
    intro: {
        fontSize:13,
        marginTop:5,
        color:'#A5A5A5',
    },
});

export default DiscoverItem;
