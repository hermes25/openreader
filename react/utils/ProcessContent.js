import JSContext from '../module/JSContext.js';
import TextStorage from '../module/TextStorage.js'
import RNFS from 'react-native-fs';

var processColor = require('processColor');

import {
  Component,
  StyleSheet,
  PixelRatio,
  Dimensions,
} from 'react-native';

var ProcessContent = {
  preName: '',
  name: '',
  nextName: '',
  preNo: 0,
  preTotal: 0,
  prePage: '',
  preContent: '',
  curPage: '',
  curContent: '',
  curNo: 0,
  curTotal: 0,
  nextPage: '',
  nextContent: '',
  nextNo: 0,
  nextTotal: 0,
  rtext: null,
  async loadPre(direction) {
    var preNo = this.preNo;
    var preTotal = this.preTotal;
    var chapterNo = this.rtext.state.chapterNo;
    var text = this.prePage;
    var preName = this.preName;

    switch (direction) {
      case 0: {
        var no = this.curNo;
        var chapterNo = this.rtext.state.chapterNo;
        var total = this.curTotal;
        var text = this.prePage;
        var name = this.name;

        if (no - 1 < 0) {
          if(chapterNo - 1 >= 0) {
              chapterNo = chapterNo - 1;

              var content = '';

              if(this.rtext.state.book.chapters[chapterNo].code != null) {
                var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;

                 content = await RNFS.readFile(filePath, 'utf8');
              } else {
                  var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
                  content = result[0];
              }

              TextStorage.init(content, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());

              total = await TextStorage.getTotal(null);
              no = total - 1;

              name = this.rtext.state.book.chapters[chapterNo].name;
              text = await TextStorage.getPage(no);

              if(text == null) {
                text = '';
              }
          }
        } else {
          no = no - 1;
          var total = await TextStorage.getTotal(null);

          if(no > total) {
            var content = '';

            if(this.rtext.state.book.chapters[chapterNo].code != null) {
              var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;

               content = await RNFS.readFile(filePath, 'utf8');
            } else {
                var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
                content = result[0];
            }

            TextStorage.init(content, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());

            total = await TextStorage.getTotal(null);
            no = total - 1;

            name = this.rtext.state.book.chapters[chapterNo].name;
            text = await TextStorage.getPage(no);

            if(text == null) {
              text = '';
            }
          } else {
              text = await TextStorage.getPage(no);
          }
        }

        this.prePage = text;
        this.preNo = no;
        this.preTotal = total;
        this.preName = name;
        if(chapterNo != this.rtext.state.chapterNo) {
          this.rtext.setState({
              chapterNo:chapterNo
          });
        }
      }
        break;
        case 1: {
          var no = this.curNo;
          var chapterNo = this.rtext.state.chapterNo;
          var total = this.curTotal;
          var text = '';
          var name = '';

          if (no - 1 < 0) {
            if(chapterNo - 1 >= 0) {
                chapterNo = chapterNo - 1;

                var content = '';

                if(this.rtext.state.book.chapters[chapterNo].code != null) {
                  var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;

                   content = await RNFS.readFile(filePath, 'utf8');
                } else {
                    var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
                    content = result[0];
                }

                TextStorage.init(content, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());

                total = await TextStorage.getTotal(null);
                no = total - 1;

                name = this.rtext.state.book.chapters[chapterNo].name;
                text = await TextStorage.getPage(no);
                if(text == null) {
                  text = '';
                }
            }
          } else {
            no = no - 1;
            text = await TextStorage.getPage(no);
          }

          this.prePage = text;
          this.preNo = no;
          this.preTotal = total;
          this.preName = name;
          this.chapterNo = chapterNo;

        }
          break;
          case 2: {
            this.prePage = this.curPage;
            this.preNo = this.curNo;
            this.preTotal = this.curTotal;
            this.preName = this.name;
            this.chapterNo = this.chapterNo;
          }
            break;

    }
  },
  async loadCur(direction) {
    switch (direction) {
      case 0: {
        this.curPage = this.prePage;
        this.curNo = this.preNo;
        this.curTotal = this.preTotal;
        this.name = this.preName;
        this.chapterNo = chapterNo;
      }
        break;
      case 1: {
        var pageNo = this.curNo;
        var pageTotal = this.curTotal;
        var chapterNo = this.rtext.state.chapterNo;
        var text = this.curPage;
        var name = this.name;

        if(this.rtext.state.book.chapters[chapterNo].code != null) {
            var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;
            this.curContent = await RNFS.readFile(filePath, 'utf8');
        } else {
            var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
            this.curContent = result[0];
        }

        TextStorage.init(this.curContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());

        name = this.rtext.state.book.chapters[chapterNo].name;
        pageTotal = await TextStorage.getTotal(null);
        text = await TextStorage.getPage(pageNo);

        this.curPage = text;
        this.curNo = pageNo;
        this.curTotal = pageTotal;
        this.name = name;
        this.chapterNo = chapterNo;
      }
        break;
      case 2: {
        this.curPage = this.nextPage;
        this.curNo = this.nextNo;
        this.curTotal = this.nextTotal;
        this.name = this.nextName;
        this.chapterNo = chapterNo;
      }
        break;
    }
  },
  async loadNext(direction) {
    switch (direction) {
      case 0: {
        this.nextPage = this.curPage;
        this.nextNo = this.curNo;
        this.nextTotal = this.curTotal;
        this.nextName = this.name;
        this.chapterNo = chapterNo;
      }
        break;
      case 1: {
        var nextNo = this.curNo;
        var nextTotal = this.curTotal;
        var chapterNo = this.rtext.state.chapterNo;
        var text = this.nextContent;
        var nextName = this.name;

        if(nextNo + 1 >= nextTotal) {
          if(chapterNo + 1 < this.rtext.state.book.chapters.length) {
              chapterNo = chapterNo + 1;
              if(this.rtext.state.book.chapters[chapterNo].code != null) {
                var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;

                 this.nextContent = await RNFS.readFile(filePath, 'utf8');
              } else {
                  var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
                  this.nextContent = result[0];
              }

              TextStorage.init(this.nextContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
              nextNo = 0;
              text = await TextStorage.getPage(nextNo);
              nextTotal = await TextStorage.getTotal(null);
              nextName = this.rtext.state.book.chapters[chapterNo].name;
          }
        } else {
          nextNo = nextNo + 1;
          text = await TextStorage.getPage(nextNo);
        }

        if (text == null) {
          text = '';
        }

        this.nextPage = text;
        this.nextNo = nextNo;
        this.nextTotal = nextTotal;
        this.nextName = nextName;
        this.chapterNo = chapterNo;
      }
        break;
      case 2: {
        var nextNo = this.curNo;
        var nextTotal = this.curTotal;
        var chapterNo = this.rtext.state.chapterNo;
        var text = this.nextContent;
        var nextName = this.name;

        if(nextNo + 1 >= nextTotal) {
          if(chapterNo + 1 < this.rtext.state.book.chapters.length) {
              chapterNo = chapterNo + 1;
              if(this.rtext.state.book.chapters[chapterNo].code != null) {
                var filePath = RNFS.DocumentDirectoryPath + '/' + this.rtext.state.book.code + '/' + this.rtext.state.book.chapters[chapterNo].code;

                 this.nextContent = await RNFS.readFile(filePath, 'utf8');
              } else {
                  var result = await JSContext.call('parseContent', [this.rtext.state.book.chapters[chapterNo].url]);
                  this.nextContent = result[0];
              }

              TextStorage.init(this.nextContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());

              nextNo = 0;
              text = await TextStorage.getPage(nextNo);
              nextTotal = await TextStorage.getTotal(null);
              nextName = this.rtext.state.book.chapters[chapterNo].name;
          }
        } else {
          nextNo = nextNo + 1;
          var total = await TextStorage.getTotal(null);
          text = await TextStorage.getPage(nextNo);
        }

        if (text == null) {
          text = '';
        }

        this.nextPage = text;
        this.nextNo = nextNo;
        this.nextTotal = nextTotal;
        this.nextName = nextName;
        if(chapterNo != this.rtext.state.chapterNo) {
          this.rtext.setState({
              chapterNo:chapterNo
          });
        }
      }
        break;
    }
  },
  async reload() {
    if(this.preContent == '') {
      if (this.curNo - 1 >= 0) {
        TextStorage.init(this.curContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
        this.preTotal = await TextStorage.getTotal(null);
        this.prePage = await TextStorage.getPage(this.curNo - 1);
        this.preNo = this.curNo - 1;
      }
    } else {
      TextStorage.init(this.preContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
      this.preTotal = await TextStorage.getTotal(null);
      this.prePage = await TextStorage.getPage(this.preNo);
    }

    TextStorage.init(this.curContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
    this.curTotal = await TextStorage.getTotal(null);
    this.curPage = await TextStorage.getPage(this.curNo);

    if(this.nextContent == '') {
      if (this.curNo + 1 < this.curTotal) {
        TextStorage.init(this.curContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
        this.nextTotal = await TextStorage.getTotal(null);
        this.nextPage = await TextStorage.getPage(this.curNo + 1);
        this.nextNo = this.curNo + 1;
      }
    } else {
      TextStorage.init(this.nextContent, Dimensions.get('window').width, Dimensions.get('window').height, this.rtext.state.left, this.rtext.state.top, this.rtext.state.lineSpacing, this.rtext.state.paragraphSpacing, this.rtext.state.fontName, this.rtext.state.fontSize, this.rtext.state.adHeight, PixelRatio.get());
      this.nextTotal = await TextStorage.getTotal(null);
      this.nextPage = await TextStorage.getPage(this.nextNo);
    }

  }
}

module.exports = ProcessContent;
