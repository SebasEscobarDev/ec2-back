import UserModel from '../operations/User.js'
const user = new UserModel()

class User {
  static async login(email) {
    return await user.login(email)
  }

  static async getAll(options) {
    return await user.getAll(options)
  }

  static async getGenderedUsers(options) {
    return await user.getGenderedUsers(options)
  }

  static async getItem(id) {
    return await user.getItem(id)
  }

  static async getItemEmail(email) {
    return await user.getItemEmail(email)
  }

  static async createItem(body) {
    return await user.createItem(body)
  }

  static async updateItem(body) {
    return await user.updateItem(body)
  }

  static async deleteItem(id) {
    return await user.deleteItem(id)
  }
  static async deleteAll() {
    return await user.deleteAll()
  }
}

export default User
