/* eslint-disable camelcase */
import NotifyModel from '../models/Notify.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class Notify {

  async getAll({ results, page, type, user_id, from_user_id, message, is_read }) {
    const options = {
      ...(type && { type }),
      ...(user_id && { user_id }),
      ...(from_user_id && { from_user_id }),
      ...(message && { message }),
      ...(is_read && { is_read }),
    }
    return await NotifyModel.findAndCountAll({
      where: options,
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
    })
  }

  async getItem(id) {
    return await NotifyModel.findByPk(id)
  }

  async deleteItem(id) {
    return await NotifyModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await NotifyModel.truncate();
  }

  async createItem(body) {
    return await NotifyModel.create({
      id: uuid4(),
      type: body.type,
      user_id: body.user_id,
      from_user_id: body.from_user_id,
      foto: body.foto,
      message: body.message,
      creado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      actualizado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    })
  }

  async updateItem(body) {
    let {
      id,
      type,
      user_id,
      from_user_id,
      foto,
      message,
      is_read
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(type && { type }),
      ...(user_id && { user_id }),
      ...(from_user_id && { from_user_id }),
      ...(foto && { foto }),
      ...(message && { message }),
      ...(is_read && { is_read }),
      ...(actualizado_el && { actualizado_el }),
    }
    return await NotifyModel.update(updateInfo, {
      where: { id }
    })
  }
}

export default Notify
