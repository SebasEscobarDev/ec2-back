import { Router } from 'express'
import { body } from 'express-validator'
import {
  getPrueba,
  getAll,
  getGenderedUsers,
  createItem,
  updateFormItem,
  getItem,
  updateItem,
  deleteItem,
  deleteAll,
  login
} from '../controllers/users.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFields } from '../middlewares/validateFields.js'
import multer from 'multer';
import path from 'path';

const router = Router()

router.get('/', getAll)

router.get('/prueba', getPrueba)

router.get('/gendered-users/:genero', getGenderedUsers)

router.get('/:id', getItem)

router.post('/', [
  body([
    'email',
    'password'
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


router.post('/form', upload.single('image'), validateToken, updateFormItem)

// ruta protegida
router.put('/', validateToken, updateItem)

// delete protegida
router.delete('/', validateToken, deleteItem)

router.delete('/all', validateToken, deleteAll)


// LOGIN
router.post('/login', [
  body('email', 'Invalid Email Number')
    .notEmpty()
    .trim(),
  body('password', 'The Password must be of minimum 4 characters length')
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
], validateFields, login)

export default router
