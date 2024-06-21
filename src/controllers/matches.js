import Match from '../ORM/factory/Match.js'
import User from '../ORM/factory/User.js'
import Notify from '../ORM/factory/Notify.js'
import Websocket from '../ORM/factory/Websocket.js'
import { handleSequelizeError } from './handleErrors/sequalizeErrors.js'

import cl from 'picocolors'

export const getAll = async (req, res, next) => {
  // paginacion
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    user_id: req.query.user_id ?? 0,
    match_user_id: req.query.match_user_id ?? 0
  }
  try {
    const { rows } = await Match.getAll(options)
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

export const getChatsUser = async (req, res, next) => {
  // paginacion
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    user_id: req.query.user_id ?? 0,
    type: 'ok'
  }
  try {
    //todos los matchs del user_id
    const { rows } = await Match.getAll(options)
    const idsMatchs = rows.map(row => row.match_user_id)
    //obtengo todos los que hicieron match con el user_id
    const { rows: chats } = await Match.getAll({ results: options.results, page: options.page, user_id: idsMatchs, match_user_id: options.user_id, type: options.type })
    const idsChats = chats.map(row => row.user_id)
    const { rows: users } = await User.getAll({ results: options.results, page: options.page, id: idsChats })
    const lastPage = Math.ceil(users.length / options.results)
    const response = {
      count: users.length,
      page: options.page,
      perPage: options.results,
      lastPage,
      rows: users
    }
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const getItem = async (req, res, next) => {
  try {
    const item = await Match.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const createItem = async (req, res, next) => {
  const options = {
    ...(req.body.notify_id && { notify_id: req.body.notify_id }),
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    user_id: req.body.user_id ?? 0,
    match_user_id: req.body.match_user_id ?? 0
  }
  let update = false;
  try {
    const { rows, count } = await Match.getAll(options)
    if (count > 0) {
      update = rows[0];
    }
  } catch (e) {
    console.log(e)
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }

  try {
    const item = update?.id
      ? await Match.updateItem({ id: update.id, ...req.body })
      : await Match.createItem(req.body);
    //validar si existe un match con el usuario solo si he dado like 
    if (req.body.type === 'ok') {
      const { rows, count: nock } = await Match.getAll({ results: options.results, page: options.page, user_id: options.match_user_id, match_user_id: options.user_id, type: 'ok' })
      if (nock > 0) {
        //actualizar notificacion recibida en Notify
        if (options?.notify_id) {
          console.log("options.notify_id")
          console.log(options)
          await Notify.updateItem({
            id: options?.notify_id,
            is_read: true
          });
        }
        //enviar notificacion a user_id y match_user_id de que han hecho kimik (nock)
        const socketIo = req.app.get('socketIo')
        try {
          const { rows, count } = await Websocket.getAll({ results: options.results, page: options.page, user_id: options.match_user_id })
          if (count > 0) {
            const matchSocketIds = rows.map(row => row.socket_id)
            const user = await User.getItem(options.user_id)
            matchSocketIds.forEach(socket_id => {
              socketIo.to(socket_id).emit('kimikNock', user);
            });
          }
        } catch (e) {
          console.log(e)
        }

        try {
          const { rows, count } = await Websocket.getAll({ results: options.results, page: options.page, user_id: options.user_id })
          if (count > 0) {
            const user = await User.getItem(options.match_user_id)
            const userSocketIds = rows.map(row => row.socket_id)
            userSocketIds.forEach(socket_id => {
              socketIo.to(socket_id).emit('kimikNock', user);
            });
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        //enviar notificacion al match si es ok
        const socketIo = req.app.get('socketIo')
        //get socket_id from websocket table
        const { rows } = await Websocket.getAll({ results: options.results, page: options.page, user_id: options.match_user_id })
        const matchSocketIds = rows.map(row => row.socket_id)
        //trae el perfil de usuario que hizo el like
        const user = await User.getItem(options.user_id)
        //crear notificacion en Notify
        const message = `${user.nombre} quiere conectar contigo`
        const notify = await Notify.createItem({
          type: 'ok',
          user_id: options.match_user_id,
          from_user_id: options.user_id,
          foto: user.foto,
          message,
        });
        console.log(notify.toJSON())
        console.log(notify.id)
        //recorre los socket_id del match_user y envia la notificacion
        matchSocketIds.forEach(socket_id => {
          socketIo.to(socket_id).emit('notifyUser', {
            id: notify.id,
            user_id: user.id,
            foto: user.foto,
            message,
            type: req.body.type
          });
        });
      }
    }
    //socketIo.emit('notifyUser', { message: 'Nuevo objeto creado', newItem: item });
    return res.status(201).json(item.toJSON())
  } catch (e) {
    console.log(e)
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await Match.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Match.deleteItem(req.body.id)
    const response = item ? 'Registro eliminado' : 'No se pudo eliminar'
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteAll = async (req, res, next) => {
  try {
    const response = await Match.deleteAll()
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}
