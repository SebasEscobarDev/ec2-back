import Message from '../ORM/factory/Message.js'
import Websocket from '../ORM/factory/Websocket.js'
import { handleSequelizeError } from './handleErrors/sequalizeErrors.js'

export const getAll = async (req, res, next) => {
  // paginacion
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 100,
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    user_id: req.params.userId ?? 0,
    to_user_id: req.params.toUserId ?? 0
  }
  try {
    const { rows } = await Message.getAll(options)
    const lastPage = Math.ceil(rows.length / options.results)
    const response = {
      count: rows.length,
      page: options.page,
      perPage: options.results,
      lastPage,
      rows
    }
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const getItem = async (req, res, next) => {
  try {
    const item = await Message.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await Message.createItem(req.body)
    if (req.body.to_user_id === 'KimikChat' || req.body.from_user_id === 'KimikChat') return res.status(201).json(item)
    //obtener socket del usuario al que le envio el mensaje
    const { count, rows } = await Websocket.getAll({ results: 100, page: 1, user_id: req.body.to_user_id })
    const soccketsUserReceived = rows?.map(row => row.socket_id)
    //enviar mensaje al usuario
    const socketIo = req.app.get('socketIo')
    soccketsUserReceived?.forEach(socket_id => {
      socketIo.to(socket_id).emit('messageReceived', { ...req.body });
    });
    return res.status(201).json(item)
  } catch (e) {
    console.log(e)
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await Message.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Message.deleteItem(req.body.id)
    const response = item ? 'Registro eliminado' : 'No se pudo eliminar'
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteAll = async (req, res, next) => {
  try {
    const response = await Message.deleteAll()
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}
