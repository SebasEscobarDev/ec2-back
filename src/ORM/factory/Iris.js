import IrisModel from '../operations/Iris.js'
const iris = new IrisModel()

class Iris {
  static async getAll(options) {
    return await iris.getAll(options)
  }

  static async getItem(id) {
    return await iris.getItem(id)
  }

  static async createItem(body) {
    return await iris.createItem(body)
  }

  static async updateItem(body) {
    return await iris.updateItem(body)
  }

  static async deleteItem(id) {
    return await iris.deleteItem(id)
  }

  static async deleteAll() {
    return await iris.deleteAll()
  }
}

export default Iris
