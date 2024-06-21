import MatchModel from '../operations/Match.js'
const match = new MatchModel()

class Match {
  static async getAll(options) {
    return await match.getAll(options)
  }

  static async getItem(id) {
    return await match.getItem(id)
  }

  static async createItem(body) {
    return await match.createItem(body)
  }

  static async updateItem(body) {
    return await match.updateItem(body)
  }

  static async deleteItem(id) {
    return await match.deleteItem(id)
  }

  static async deleteAll() {
    return await match.deleteAll()
  }
}

export default Match
