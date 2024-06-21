import PurchaseModel from '../operations/Purchase.js'
const purchase = new PurchaseModel()

class Purchase {
  static async getAll(options) {
    return await purchase.getAll(options)
  }

  static async getItem(id) {
    return await purchase.getItem(id)
  }

  static async createItem(body) {
    return await purchase.createItem(body)
  }

  static async updateItem(body) {
    return await purchase.updateItem(body)
  }

  static async deleteItem(id) {
    return await purchase.deleteItem(id)
  }
  static async deleteAll() {
    return await purchase.deleteAll()
  }
}

export default Purchase
