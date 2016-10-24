import Icon from 'react-native-vector-icons/Ionicons';

import React, {
    View,
    Text,
    PixelRatio,
    ListView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

var BookmarkView = React.createClass({
  bookmarks : [],
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});

    return {
        selectAll: false,
        dataSource: ds.cloneWithRows([]),
    };
  },
  render() {
      return (
              <View style={{flex:1, backgroundColor:'rgb(240, 240, 240)'}}>
                  <ListView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  enableEmptySections={true}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow}/>
                  <View>
                  <View style={{height:50, flexDirection: 'row', marginLeft: 25, alignItems: 'center', borderTopWidth: 2/PixelRatio.get(), borderColor:'rgb(230, 230, 230)'}}><TouchableOpacity onPress={() => this.pressSelectAll()}>
                            {this.state.selectAll?<Icon
                              name={'ios-checkmark-circle'}
                              size={16}
                              color={'rgb(252, 98, 77)'}
                            />:<Icon
                              name={'ios-radio-button-off'}
                              size={16}
                              color={'rgb(179, 179, 179)'}
                            />}
                      </TouchableOpacity><Text style={{fontSize: 14, color: 'rgb(254, 96, 77)', marginLeft: 10}} onPress={() => this.pressDelete()}>删除选定章节</Text></View>
                </View>
        </View>
      );
  },
  setBookmarks(marks) {
    this.bookmarks = [];

    for(var k in marks) {
      if(k != '_id') {
          this.bookmarks[this.bookmarks.length] = marks[k];
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.bookmarks),
    });
  },
  pressCheck(index) {
      if(this.bookmarks[index].state == 0){
        this.bookmarks[index].state = 1;
      } else {
        this.bookmarks[index].state = 0;
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.bookmarks),
      });
  },
  renderRow(rowData, sectionId, rowId) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 25,paddingTop: 20, paddingRight: 15, paddingBottom: 20, borderBottomWidth: 2/PixelRatio.get(), borderColor: 'rgb(236, 236, 236)'}}>
        <View>
         {rowData.state == 0?<TouchableOpacity onPress={() => this.pressCheck(rowId)}><Icon
           name={'ios-radio-button-off'}
           size={16}
           color={'rgb(179, 179, 179)'}
         /></TouchableOpacity>:null}
         {rowData.state == 1?<TouchableOpacity onPress={() => this.pressCheck(rowId)}><Icon
           name={'ios-checkmark-circle'}
           size={16}
           color={'rgb(252, 98, 77)'}
         /></TouchableOpacity>:null}
        </View>
        <TouchableOpacity style={{marginLeft: 10, flex:1,}} onPress={() => this.props.main.hideDirectoryPanel(rowData.no)}>
          {rowData.no == this.props.main.state.chapterNo?<Text style={{color:'rgb(252, 98, 77)', fontSize:14}}>
            {rowData.name}
          </Text>:<Text style={{color:'rgb(87, 87, 87)', fontSize:14}}>
            {rowData.name}
          </Text>}
        </TouchableOpacity>
      </View>
    );
  },
  pressSelectAll() {
    if (this.state.selectAll) {
      for(var i=0;i< this.bookmarks.length;i++) {
        this.bookmarks[i].state = 0;
      }
    } else {
      for(var i=0;i< this.bookmarks.length;i++) {
        this.bookmarks[i].state = 1;
      }
    }

    this.setState({
      selectAll: !this.state.selectAll,
      dataSource: this.state.dataSource.cloneWithRows(this.bookmarks),
    });
  },
  async pressDelete() {
    var bookmarks = {};

    for(var i = this.bookmarks.length-1; i >= 0; i--) {
      if(this.bookmarks[i].state == 1) {
        this.bookmarks.splice(i,1);
      }
    }

    for(var i=0;i<this.bookmarks.length;i++) {
      bookmarks['' + this.bookmarks[i].no] = this.bookmarks[i];
    }

    this.setState({
      selectAll: false,
      dataSource: this.state.dataSource.cloneWithRows(this.bookmarks),
    });

    this.props.main.setState({
      bookmarks:bookmarks,
    })

  },
});

export default BookmarkView;
