/* eslint-disable camelcase */
import GenreModel from '../models/Genre.js'

class Genre {

  async getAll() {
    return await GenreModel.findAndCountAll()
  }

  async getItem(id) {
    return await GenreModel.findByPk(id)
  }

  async deleteItem(id) {
    return await GenreModel.destroy({
      where: { id }
    })
  }

  async deleteAll() {
    return await GenreModel.truncate();
  }

  async createItem(body) {
    return await GenreModel.create({
      genero_es: body.genero_es,
      genero_en: body.genero_en,
      genero_pt: body.genero_pt,
    })
  }

  async updateItem(body) {
    let {
      id,
      genero_es,
      genero_en,
      genero_pt
    } = body

    const updateInfo = {
      ...(genero_es && { genero_es }),
      ...(genero_en && { genero_en }),
      ...(genero_pt && { genero_pt }),
    }
    return await GenreModel.update(updateInfo, {
      where: { id }
    })
  }
}

export default Genre
