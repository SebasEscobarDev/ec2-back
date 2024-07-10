import UserModel from '../operations/User.js'
const operations = new UserModel()

class User {
  static async login(email) {
    return await operations.login(email)
  }

  static async getAll(options) {
    return await operations.getAll(options)
  }

  static async getAllFilters(options) {
    return await operations.getAllFilters(options)
  }

  static async getGenderedUsers(options) {
    return await operations.getGenderedUsers(options)
  }

  static async getItem(id) {
    return await operations.getItem(id)
  }

  static async getItemEmail(email) {
    return await operations.getItemEmail(email)
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

export default User
