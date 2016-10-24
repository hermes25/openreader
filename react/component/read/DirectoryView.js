import Icon from 'react-native-vector-icons/Ionicons';

import React, {
    View,
    Text,
    PixelRatio,
    ListView,
    TouchableOpacity,
} from 'react-native';

var chapters = [];

var DirectoryView = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});

    return {
        selectAll: false,
        dataSource: ds.cloneWithRows([]),
    };
  },
  renderRow(rowData, sectionId, rowId) {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 25,paddingTop: 20, paddingRight: 15, paddingBottom: 20, borderBottomWidth: 2/PixelRatio.get(), borderColor: 'rgb(236, 236, 236)'}}>
        {this.state.download == 0?<View>
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
         {rowData.state == 2?<Icon
           name={'md-cloud-done'}
           size={18}
           color={'rgb(179, 179, 179)'}
         />:null}
        </View>:<View>
            {rowData.state == 0?<View
              style={{width:16, height:16}}/>:null}
            {rowData.state == 1?<Icon
              name={'md-cloud-download'}
              size={18}
              color={'rgb(179, 179, 179)'}
            />:null}
            {rowData.state == 2?<Icon
              name={'md-cloud-done'}
              size={18}
              color={'rgb(179, 179, 179)'}
            />:null}
        </View>}
        <TouchableOpacity style={{marginLeft: 10, flex:1,}} onPress={() => this.props.main.hideDirectoryPanel(rowId)}>
          {rowId == this.props.main.state.chapterNo?<Text style={{color:'rgb(252, 98, 77)', fontSize:14}}>
            {rowData.name}
          </Text>:<Text style={{color:'rgb(87, 87, 87)', fontSize:14}}>
            {rowData.name}
          </Text>}
        </TouchableOpacity>
      </View>
    );
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
                  {this.state.download == 0?<View style={{height:50, flexDirection: 'row', marginLeft: 25, alignItems: 'center', borderTopWidth: 2/PixelRatio.get(), borderColor:'rgb(230, 230, 230)'}}><TouchableOpacity onPress={() => this.pressSelectAll()}>
                            {this.state.selectAll?<Icon
                              name={'ios-checkmark-circle'}
                              size={16}
                              color={'rgb(252, 98, 77)'}
                            />:<Icon
                              name={'ios-radio-button-off'}
                              size={16}
                              color={'rgb(179, 179, 179)'}
                            />}
                      </TouchableOpacity><Text style={{fontSize: 14, color: 'rgb(254, 96, 77)', marginLeft: 10}} onPress={() => this.pressDownload()}>缓存选定章节</Text></View>:null}
                </View>
        </View>
      );
  },
  setBook(book) {
    chapters = book.chapters;
    this.setState({
      download: book.download,
      dataSource: this.state.dataSource.cloneWithRows(chapters),
    });
  },
  pressCheck(index) {
      if(chapters[index].state == 0){
        chapters[index].state = 1;
      } else {
        chapters[index].state = 0;
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(chapters),
      });
  },
  pressSelectAll() {
    if (this.state.selectAll) {
      for(var i=0;i< chapters.length;i++) {
        chapters[i].state = 0;
      }
    } else {
      for(var i=0;i< chapters.length;i++) {
        chapters[i].state = 1;
      }
    }

    this.setState({
      selectAll: !this.state.selectAll,
      dataSource: this.state.dataSource.cloneWithRows(chapters),
    });
  },
  async pressDownload() {
    this.setState({
      download: 1,
    });

    var book = this.props.main.state.book;
    book.download = 1;
    book.chapters = chapters;

    await this.props.main.bookDao.updateById(book, book._id);
    this.props.main.props.indexJs.pressDownload();
  },
});

export default DirectoryView;
