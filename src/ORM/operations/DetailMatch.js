/* eslint-disable camelcase */
import DetailMatchModel from '../models/DetailMatch.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class DetailMatch {

  async getAll({ results, page }) {
    return await DetailMatchModel.findAndCountAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      raw: true
    })
  }

  async getItem(id) {
    return await DetailMatchModel.findByPk(id, { raw: true })
  }

  async deleteItem(id) {
    return await DetailMatchModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await DetailMatchModel.truncate();
  }

  async createItem(body) {
    return await DetailMatchModel.create({
      id: uuid4(),
      detalle: body.detalle,
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
      detalle
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(detalle && { detalle }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await DetailMatchModel.update(updateInfo, {
      where: { id },
      raw: true
    })
    if (up.length) {
      return await DetailMatchModel.findByPk(id, { raw: true })
    } else {
      return null
    }
  }
}

export default DetailMatch
