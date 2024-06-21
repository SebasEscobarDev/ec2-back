/* eslint-disable camelcase */
import PurchaseModel from '../models/Purchase.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class Purchase {

  async getAll({ results, page }) {
    return await PurchaseModel.findAndCountAll({
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      raw: true
    })
  }

  async getItem(id) {
    return await PurchaseModel.findByPk(id, { raw: true })
  }

  async deleteItem(id) {
    return await PurchaseModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await PurchaseModel.truncate();
  }

  async createItem(body) {
    return await PurchaseModel.create({
      id: uuid4(),
      valor: body.valor,
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
      valor,
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(valor && { valor }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await PurchaseModel.update(updateInfo, {
      where: { id },
      raw: true
    })
    if (up.length) {
      return await PurchaseModel.findByPk(id, { raw: true })
    } else {
      return null
    }
  }
}

export default Purchase
