import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';

/**
 * 收藏结果单行布局
 * 例如：<DiscoverItem item={item}/>
 * @module DiscoverItem
 * @param {String} item.cover 内容封面
 * @param {String} item.name 内容名称
 * @param {String} item.state 内容状态 2、处理中  3、更新中
 * @param {String} item.author 内容作者
 * @param {String} item.intro 内容介绍
 * @param {String} item.last 内容最新更新
 */
class FavoriteItem extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.cover}>
                    <Image style={styles.image}
                           source={{uri:this.props.item.cover}}
                           resizeMode="contain"/>
                </View>
                <View style={styles.detail}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.name} numberOfLines={1}>{this.props.item.name}</Text>
                      {this.props.item.state == '2'?<View style={styles.update}>
                          <Text style={{fontSize: 10, color: 'rgb(255, 255, 255)'}}>处理中</Text>
                      </View>:null}
                      {this.props.item.state == '3'?<View style={styles.handle}>
                          <Text style={{fontSize: 10, color: 'rgb(255, 255, 255)'}}>更新中</Text>
                      </View>:null}
                    </View>
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
        marginLeft:10,
    },
    name: {
        fontSize:15,
        marginTop:5,
    },
    author: {
        fontSize:13,
        marginTop:5,
        color:'#A5A5A5',
    },
    intro: {
        fontSize:13,
        marginTop:5,
        color:'#A5A5A5',
    },
    last: {
        fontSize:13,
        marginTop:5,
        color:'#A5A5A5',
    },
    update: {
        marginTop: 2,
        marginLeft: 10,
        backgroundColor: 'rgb(138, 197, 238)',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },
    handle: {
        marginTop: 2,
        marginLeft: 10,
        backgroundColor: 'rgb(251, 188, 130)',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },
});

export default FavoriteItem;
