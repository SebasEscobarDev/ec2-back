import { Router } from 'express'
import { body } from 'express-validator'
import {
  getAll,
  createItem,
  createFormItem,
  getItem,
  getCoupleUser,
  updateItem,
  deleteItem,
  deleteAll
} from '../controllers/couples.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
import multer from 'multer';
import path from 'path';

const router = Router()

router.get('/', getAll)

router.get('/:id', getItem)

router.get('/user/:id', getCoupleUser)

router.post('/', [
  body([
    'nombre',
    'genero_identifica'
  ], 'field is required.').notEmpty().escape().trim().isLength({ min: 3 })
], validateFields, createItem)



// Configuración de multer para almacenar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(req.app.get('__dirname'), 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});


router.post('/form', upload.single('image'), validateToken, createFormItem)

// ruta protegida
router.put('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)

router.delete('/all', validateToken, deleteAll)

export default router
