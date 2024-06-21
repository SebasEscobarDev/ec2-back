import NotifyModel from '../operations/Notify.js'
const notify = new NotifyModel()

class Notify {
  static async getAll(options) {
    return await notify.getAll(options)
  }

  static async getItem(id) {
    return await notify.getItem(id)
  }

  static async createItem(body) {
    return await notify.createItem(body)
  }

  static async updateItem(body) {
    return await notify.updateItem(body)
  }

  static async deleteItem(id) {
    return await notify.deleteItem(id)
  }

  static async deleteAll() {
    return await notify.deleteAll()
  }
}

export default Notify
