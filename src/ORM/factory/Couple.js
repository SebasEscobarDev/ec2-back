import CoupleModel from '../operations/Couple.js'
const couple = new CoupleModel()

class Couple {

  static async getAll(options) {
    return await couple.getAll(options)
  }

  static async getItem(id) {
    return await couple.getItem(id)
  }

  static async createItem(body) {
    return await couple.createItem(body)
  }

  static async updateItem(body) {
    return await couple.updateItem(body)
  }

  static async deleteItem(id) {
    return await couple.deleteItem(id)
  }
  static async deleteAll() {
    return await couple.deleteAll()
  }
}

export default Couple
