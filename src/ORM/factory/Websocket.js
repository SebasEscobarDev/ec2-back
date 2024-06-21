import WebsocketModel from '../operations/Websocket.js'
const websocket = new WebsocketModel()

class Websocket {
  static async getAll(options) {
    return await websocket.getAll(options)
  }

  static async getItem(id) {
    return await websocket.getItem(id)
  }

  static async createItem(body) {
    return await websocket.createItem(body)
  }

  static async updateItem(body) {
    return await websocket.updateItem(body)
  }

  static async deleteItem(id) {
    return await websocket.deleteItem(id)
  }

  static async deleteAll() {
    return await websocket.deleteAll()
  }
}

export default Websocket
