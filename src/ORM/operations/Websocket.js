/* eslint-disable camelcase */
import WebsocketModel from '../models/Websocket.js'
import moment from 'moment'
import uuid4 from 'uuid4'


class Websocket {

  async getAll({ results, page, user_id }) {
    return await WebsocketModel.findAndCountAll({
      offset: (page - 1) * results,
      ...(user_id && { where: { user_id } }),
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ]
    })
  }

  async getItem(id) {
    return await WebsocketModel.findByPk(id, { raw: true })
  }

  async deleteItem(id) {
    return await WebsocketModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await WebsocketModel.truncate();
  }

  async createItem(body) {
    return await WebsocketModel.create({
      id: uuid4(),
      user_id: body.user_id,
      socket_id: body.socket_id,
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
      user_id,
      socket_id
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(user_id && { user_id }),
      ...(socket_id && { socket_id }),
      ...(actualizado_el && { actualizado_el })
    }

    const up = await Websocket.update(updateInfo, {
      where: { id },
      raw: true
    })
    if (up.length) {
      return await Websocket.findByPk(id, { raw: true })
    } else {
      return null
    }
  }
}

export default Websocket
