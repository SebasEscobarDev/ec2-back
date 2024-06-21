import MessageModel from '../operations/Message.js'
const message = new MessageModel()

class Message {
  static async getAll(options) {
    return await message.getAll(options)
  }

  static async getItem(id) {
    return await message.getItem(id)
  }

  static async createItem(body) {
    return await message.createItem(body)
  }

  static async updateItem(body) {
    return await message.updateItem(body)
  }

  static async deleteItem(id) {
    return await message.deleteItem(id)
  }

  static async deleteAll() {
    return await message.deleteAll()
  }
}

export default Message
