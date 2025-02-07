import GenreModel from '../operations/Genre.js'
const operations = new GenreModel()

class Genre {
  static async getAll() {
    return await operations.getAll()
  }

  static async getItem(id) {
    return await operations.getItem(id)
  }

  static async createItem(body) {
    return await operations.createItem(body)
  }

  static async updateItem(body) {
    return await operations.updateItem(body)
  }

  static async deleteItem(id) {
    return await operations.deleteItem(id)
  }

  static async deleteAll() {
    return await operations.deleteAll()
  }
}

export default Genre
