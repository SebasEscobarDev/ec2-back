/* eslint-disable camelcase */
import CoupleModel from '../models/Couple.js'
import moment from 'moment'
import uuid4 from 'uuid4'

class Couple {

  async getAll({ results, page, id }) {
    return await CoupleModel.findAndCountAll({
      ...(id && { where: { id } }),
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ]
    })
  }

  async getItem(id) {
    return await CoupleModel.findByPk(id)
  }

  async deleteItem(id) {
    return await CoupleModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await CoupleModel.truncate();
  }

  async createItem(body) {
    return await CoupleModel.create({
      id: uuid4(),
      nombre: body.nombre,
      nacimiento_hora: body?.nacimiento_hora,
      nacimiento_dia: body.nacimiento_dia,
      nacimiento_mes: body.nacimiento_mes,
      nacimiento_ano: body.nacimiento_ano,
      genero_identifica: body.genero_identifica,
      foto: body.foto,
      acerca: body.acerca,
      user_id: body.user_id,
      creado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      actualizado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    })
  }

  async updateItem(body) {
    let {
      id,
      nombre,
      nacimiento_hora,
      nacimiento_dia,
      nacimiento_mes,
      nacimiento_ano,
      genero_identifica,
      foto,
      acerca,
      user_id
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    // if (fecha_nacimiento) fecha_nacimiento = moment(fecha_nacimiento, 'DD-MM-YYYY').utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(nombre && { nombre }),
      ...(nacimiento_hora && { nacimiento_hora }),
      ...(nacimiento_dia && { nacimiento_dia }),
      ...(nacimiento_mes && { nacimiento_mes }),
      ...(nacimiento_ano && { nacimiento_ano }),
      ...(genero_identifica && { genero_identifica }),
      ...(foto && { foto }),
      ...(acerca && { acerca }),
      ...(user_id && { user_id }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await CoupleModel.update(updateInfo, {
      where: { id }
    })
    if (up.length) {
      return await CoupleModel.findByPk(id)
    } else {
      return null
    }
  }
}

export default Couple
