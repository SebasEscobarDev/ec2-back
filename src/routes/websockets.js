import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  deleteAll
} from '../controllers/websockets.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/', validateToken, getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'user_id',
    'socket_id',
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateToken, validateFields, createItem)

// ruta protegida
router.put('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)
router.delete('/all', validateToken, deleteAll)

export default router
