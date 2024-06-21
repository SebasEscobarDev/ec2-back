import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  deleteAll
} from '../controllers/messages.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()

router.get('/user/:userId/to/:toUserId', validateToken, getAll)

router.get('/:id', validateToken, getItem)

router.post('/', [
  body([
    'from_user_id',
    'to_user_id',
    'message',
  ], 'field is required!!!.').notEmpty().escape().trim().isLength({ min: 1 })
], validateToken, validateFields, createItem)

// ruta protegida
router.put('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)
router.delete('/all', validateToken, deleteAll)

export default router
