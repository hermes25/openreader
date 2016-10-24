import Store from 'react-native-store';

class BookDAO {

  constructor() {
      this.model = Store.model('book');
  }

  async add(p) {
    return await this.model.add(p);
  }

  async updateById(d, i) {
    return await this.model.updateById(d, i);
  }

  async find(p) {
    return await this.model.find(p);
  }

  findById(i) {
    return this.model.findById(i);
  }

  async removeById(p) {
    return await this.model.removeById(p);
  }

}

module.exports = BookDAO;
