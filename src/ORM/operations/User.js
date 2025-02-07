/* eslint-disable camelcase */
import UserModel from '../models/User.js'
import moment from 'moment'
import bcrypt from 'bcryptjs'
import uuid4 from 'uuid4'
import { Op } from 'sequelize'
import Genre from '../models/Genre.js'

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

const formatDate = () => moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss');

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
        id: { [Op.ne]: user.id },
        app: { [Op.or]: ['Citas', 'Dates', 'Encontros'] },
        genero_identifica: { [Op.in]: user.genero_interes.split(',') },
        genero_interes: { [Op.like]: `%${user.genero_identifica}%` },
      },
      offset: (page - 1) * results,
      limit: results,
      order: [
        ['creado_el', 'ASC']
      ],
      attributes: ARRAY_ATTRIBUTES
    })
  }

  async getItem(id) {
    return await UserModel.findByPk(id, {
      include: 'matches', attributes: ARRAY_ATTRIBUTES, raw: true
    })
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
      creado_el: formatDate(),
      actualizado_el: formatDate(),
    },
      {
        attributes: ARRAY_ATTRIBUTES,
        raw: true
      }
    )
  }

  async updateItem(body) {
    const actualizado_el = formatDate();
    if (body.password) body.password = await bcrypt.hash(body.password, 12);

    const updateInfo = {
      ...body,
      actualizado_el,
    };

    const [rowsUpdated] = await UserModel.update(updateInfo, {
      where: { id: body.id },
    });

    return rowsUpdated ? this.getItem(body.id) : null;
  }
}

export default User
