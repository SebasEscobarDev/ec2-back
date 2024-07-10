/* eslint-disable camelcase */
import UserModel from '../models/User.js'
import moment from 'moment'
import bcrypt from 'bcryptjs'
import uuid4 from 'uuid4'
import { Op } from 'sequelize'

const ARRAY_ATTRIBUTES = [
  'id',
  'email',
  // 'password', hide this
  'nombre',
  'nacimiento_hora',
  'nacimiento_dia',
  'nacimiento_mes',
  'nacimiento_ano',
  'nacimiento_ciudad',
  'genero_mostrar',
  'genero_identifica',
  'genero_interes',
  'foto',
  'acerca',
  'enfermedad_ojos',
  'tipo_luz',
  'lugar_toma_foto',
  'rango_edad',
  'app',
  'creado_el',
  'actualizado_el',
]

class User {
  async login(email) {
    return await UserModel.findOne({
      where: { email },
      raw: true
    })
  }

  async getAll({ results, page, id }) {
    return await UserModel.findAndCountAll({
      ...(id && { where: { id } }),
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES,
      include: 'matches'
    })
  }

  async getAllFilters({ results, page, user }) {
    return await UserModel.findAndCountAll({
      where: {
        id: {
          [Op.ne]: user.id
        },
        app: 'Citas',
        genero_identifica: {
          [Op.in]: user.genero_interes.split(',')
        },
        genero_interes: {
          [Op.like]: `%${user.genero_identifica}%`
        },
      },
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES
    })
  }

  async getGenderedUsers({ results, page, genero_identifica }) {
    return await UserModel.findAndCountAll({
      where: { genero_identifica },
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES,
    })
  }

  async getItem(id) {
    return await UserModel.findByPk(id, { include: 'matches', attributes: ARRAY_ATTRIBUTES, raw: true })
  }

  async getItemEmail(email) {
    return await UserModel.findOne({
      where: { email },
      include: 'matches',
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    })
  }

  async deleteItem(id) {
    return await UserModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await UserModel.truncate();
  }


  async createItem(body) {
    const hashPass = await bcrypt.hash(body.password, 12)
    return await UserModel.create({
      id: uuid4(),
      email: body.email,
      password: hashPass,
      creado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      actualizado_el: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')
    },
      {
        attributes: ARRAY_ATTRIBUTES,
        raw: true
      }
    )
  }

  async updateItem(body) {
    let {
      id,
      email,
      password,
      nombre,
      nacimiento_hora,
      nacimiento_dia,
      nacimiento_mes,
      nacimiento_ano,
      nacimiento_ciudad,
      genero_mostrar,
      genero_identifica,
      genero_interes,
      foto,
      acerca,
      enfermedad_ojos,
      tipo_luz,
      lugar_toma_foto,
      rango_edad,
      app
    } = body
    const actualizado_el = moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    if (password) password = await bcrypt.hash(password, 12)

    // if (fecha_nacimiento) fecha_nacimiento = moment(fecha_nacimiento, 'DD-MM-YYYY').utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss')

    const updateInfo = {
      ...(email && { email }),
      ...(password && { password }),
      ...(email && { email }),
      ...(password && { password }),
      ...(nombre && { nombre }),
      ...(nacimiento_hora && { nacimiento_hora }),
      ...(nacimiento_dia && { nacimiento_dia }),
      ...(nacimiento_mes && { nacimiento_mes }),
      ...(nacimiento_ano && { nacimiento_ano }),
      ...(nacimiento_ciudad && { nacimiento_ciudad }),
      ...(genero_mostrar && { genero_mostrar }),
      ...(genero_identifica && { genero_identifica }),
      ...(genero_interes && { genero_interes }),
      ...(foto && { foto }),
      ...(acerca && { acerca }),
      ...(enfermedad_ojos && { enfermedad_ojos }),
      ...(tipo_luz && { tipo_luz }),
      ...(lugar_toma_foto && { lugar_toma_foto }),
      ...(rango_edad && { rango_edad }),
      ...(app && { app }),
      ...(actualizado_el && { actualizado_el }),
    }
    const up = await UserModel.update(updateInfo, {
      where: { id },
      attributes: ARRAY_ATTRIBUTES,
      raw: true
    })
    if (up.length) {
      return await UserModel.findByPk(id, { attributes: ARRAY_ATTRIBUTES, raw: true })
    } else {
      return null
    }
  }
}

export default User
