import Couple from '../ORM/factory/Couple.js'
import { handleSequelizeError } from './handleErrors/sequalizeErrors.js'
import { env } from '../environment.js'

export const getAll = async (req, res, next) => {
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1
  }
  try {
    const { rows } = await Couple.getAll(options)
    const lastPage = Math.ceil(rows.length / options.results)
    const response = {
      count: rows.length,
      page: options.page,
      perPage: options.results,
      lastPage,
      rows,
    }
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const getItem = async (req, res, next) => {
  try {
    const item = await Couple.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await Couple.createItem(req.body)
    return res.status(201).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const createFormItem = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const fileUrl = `http://localhost:${env.APP_PORT}/uploads/${req.file.filename}`;
  req.body.foto = fileUrl;
  try {
    const item = await Couple.createItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await Couple.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Couple.deleteItem(req.body.id)
    const response = item ? 'Registro eliminado' : 'No se pudo eliminar'
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteAll = async (req, res, next) => {
  try {
    const response = await Couple.deleteAll()
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}
