import CompatibilityModel from '../operations/Compatibility.js'
const operations = new CompatibilityModel()

class Compatibility {
  static async getAll(options) {
    return await operations.getAll(options)
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

export default Compatibility
