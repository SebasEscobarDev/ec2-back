/* eslint-disable camelcase */
import CompatibilityModel from '../models/Compatibility.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class Compatibility {

  async getAll({ results, page, perfil_user_id, user_id }) {
    const options = {
      ...(perfil_user_id && { perfil_user_id }),
      ...(user_id && { user_id }),
    }
    return await CompatibilityModel.findAndCountAll({
      where: options,
      offset: (page - 1) * results,
      limit: results,
    })
  }

  async getItem(id) {
    return await CompatibilityModel.findByPk(id)
  }

  async deleteItem(id) {
    return await CompatibilityModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await CompatibilityModel.truncate();
  }

  async createItem(body) {
    return await CompatibilityModel.create({
      id: uuid4(),
      perfil_user_id: body.perfil_user_id,
      user_id: body.user_id
    })
  }

  async updateItem(body) {
    let {
      id,
      perfil_user_id,
      user_id,
    } = body

    const updateInfo = {
      ...(perfil_user_id && { perfil_user_id }),
      ...(user_id && { user_id }),
    }
    const up = await CompatibilityModel.update(updateInfo, {
      where: { id }
    })
    if (up.length) {
      return await CompatibilityModel.findByPk(id)
    } else {
      return null
    }
  }

  async createOrUpdate(body) {
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')



    return await CompatibilityModel.findOrCreate({
      where: { perfil_user_id: body.perfil_user_id, user_id: body.user_id },
      defaults: {
        id: uuid4(),
        score: body.score,
      },
    });
  }
}

export default Compatibility
