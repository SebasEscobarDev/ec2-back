import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  deleteAll
} from '../controllers/genres.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
const router = Router()


router.get('/', getAll)

router.get('/:id', getItem)

router.post('/', [
  body([
    'genero_es',
    'genero_en',
    'genero_pt',
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 2 })
], validateToken, validateFields, createItem)

// ruta protegida
router.put('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)
router.delete('/all', validateToken, deleteAll)

export default router
