/* eslint-disable camelcase */
import MessageModel from '../models/Message.js'
import moment from 'moment'
import { Op } from 'sequelize'
import uuid4 from 'uuid4'

class Message {

  async getAll({ results, page, user_id, to_user_id }) {
    return await MessageModel.findAndCountAll({
      where: {
        [Op.or]: [
          {
            from_user_id: user_id,
            to_user_id: to_user_id
          },
          {
            from_user_id: to_user_id,
            to_user_id: user_id
          }
        ]
      },
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      raw: true
    })
  }

  async getItem(id) {
    return await MessageModel.findByPk(id, { raw: true })
  }

  async deleteItem(id) {
    return await MessageModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await MessageModel.truncate();
  }

  async createItem({ from_user_id, to_user_id, message }) {
    return await MessageModel.create({
      id: uuid4(),
      from_user_id: from_user_id,
      to_user_id: to_user_id,
      message: message,
      creado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      actualizado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    },
      {
        raw: true
      }
    )
  }

  async updateItem(body) {
    let {
      id,
      from_user_id,
      to_user_id,
      message,
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(from_user_id && { from_user_id }),
      ...(to_user_id && { to_user_id }),
      ...(message && { message }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await MessageModel.update(updateInfo, {
      where: { id },
      raw: true
    })
    if (up.length) {
      return await MessageModel.findByPk(id, { raw: true })
    } else {
      return null
    }
  }
}

export default Message
