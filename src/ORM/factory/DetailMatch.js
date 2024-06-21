import DetailMatchModel from '../operations/DetailMatch.js'
const detailmatch = new DetailMatchModel()

class DetailMatch {
  static async getAll(options) {
    return await detailmatch.getAll(options)
  }

  static async getItem(id) {
    return await detailmatch.getItem(id)
  }

  static async createItem(body) {
    return await detailmatch.createItem(body)
  }

  static async updateItem(body) {
    return await detailmatch.updateItem(body)
  }

  static async deleteItem(id) {
    return await detailmatch.deleteItem(id)
  }

  static async deleteAll() {
    return await detailmatch.deleteAll()
  }
}

export default DetailMatch
