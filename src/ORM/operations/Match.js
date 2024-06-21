/* eslint-disable camelcase */
import MatchModel from '../models/Match.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class Match {

  async getAll({ results, page, user_id, match_user_id, type }) {
    const options = {
      ...(user_id && { user_id }),
      ...(match_user_id && { match_user_id }),
      ...(type && { type })
    }
    return await MatchModel.findAndCountAll({
      where: options,
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
    })
  }

  async getItem(id) {
    return await MatchModel.findByPk(id)
  }

  async deleteItem(id) {
    return await MatchModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await MatchModel.truncate();
  }

  async createItem(body) {
    return await MatchModel.create({
      id: uuid4(),
      user_id: body.user_id,
      match_user_id: body.match_user_id,
      type: body.type,
      creado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      actualizado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    })
  }

  async updateItem(body) {
    let {
      id,
      user_id,
      match_user_id,
      type
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(user_id && { user_id }),
      ...(match_user_id && { match_user_id }),
      ...(type && { type }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await MatchModel.update(updateInfo, {
      where: { id }
    })
    if (up.length) {
      return await MatchModel.findByPk(id)
    } else {
      return null
    }
  }
}

export default Match
