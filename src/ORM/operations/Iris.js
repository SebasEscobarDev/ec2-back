/* eslint-disable camelcase */
import IrisModel from '../models/Iris.js'
import moment from 'moment'

class Iris {

  async getAll({ results, page }) {
    return await IrisModel.findAndCountAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      raw: true
    })
  }

  async getItem(id) {
    return await IrisModel.findByPk(id, { raw: true })
  }

  async deleteItem(id) {
    return await IrisModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await IrisModel.truncate();
  }

  async createItem(body) {
    return await IrisModel.create({
      user_id: body.user_id,
      racional: body.racional,
      emocional: body.emocional,
      mental: body.mental,
      amar: body.amar,
      autoconocimiento: body.autoconocimiento,
      espiritual: body.espiritual,
      responsabilidad: body.responsabilidad,
      autonomia: body.autonomia,
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
      racional,
      emocional,
      mental,
      amar,
      autoconocimiento,
      espiritual,
      responsabilidad,
      autonomia
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(user_id && { user_id }),
      ...(racional && { racional }),
      ...(emocional && { emocional }),
      ...(mental && { mental }),
      ...(amar && { amar }),
      ...(autoconocimiento && { autoconocimiento }),
      ...(espiritual && { espiritual }),
      ...(responsabilidad && { responsabilidad }),
      ...(autonomia && { autonomia }),
      ...(actualizado_el && { actualizado_el })
    }
    const up = await IrisModel.update(updateInfo, {
      where: { id },
      raw: true
    })
    if (up.length) {
      return await IrisModel.findByPk(id, { raw: true })
    } else {
      return null
    }
  }
}

export default Iris
