import User from '../ORM/factory/User.js'
import Compatibility from '../ORM/factory/Compatibility.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { handleSequelizeError } from './handleErrors/sequalizeErrors.js'
import { env } from '../environment.js'
import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'
import Iris from '../ORM/factory/Iris.js'


export const getAll = async (req, res, next) => {
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1
  }
  try {
    const { rows } = await User.getAll(options)
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


export const getAllFilters = async (req, res, next) => {
  const user = await User.getItem(req.params.user_id)
  const options = {
    results: req.query.results ? parseInt(req.query.results, 10) : 10,
    page: req.query.page ? parseInt(req.query.page, 10) : 1,
    user
  }
  try {
    const { rows } = await User.getAllFilters(options)
    //each rows and insert new field compatibility named afinidad
    // const newRows = rows.map(async (row) => {
    //   const compatibility = await Compatibility.getAll({
    //     perfil_user_id: row.id,
    //     user_id: user.id
    //   })
    //   return {
    //     ...row,
    //     afinidad: compatibility.rows[0]?.score ?? 0
    //   }
    // })

    // console.log("1====================================")
    // Console.log("ROWS")
    // console.log(newRows)
    // console.log("2====================================")


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
    const item = await User.getItem(req.params.id)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const createItem = async (req, res, next) => {
  try {
    const item = await User.createItem(req.body)
    const token = jwt.sign({ id: item.id }, env.SECRET_KEY, { expiresIn: '24h' })
    return res.status(201).json({
      token,
      user: item
    })
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const updateFormItem = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const fileUrl = `uploads/${req.file.filename}`;
  // res.json({ url: fileUrl });
  req.body.foto = fileUrl;
  try {

    const user = await User.updateItem(req.body)
    // Reemplazar géneros existentes con los nuevos IDs


    const options = {
      results: req.query.results ? parseInt(req.query.results, 10) : 100000000,
      page: req.query.page ? parseInt(req.query.page, 10) : 1,
      user
    }

    const { count, rows } = await User.getAllFilters(options)
    const lastPage = Math.ceil(rows.length / options.results)

    // filtrar usuarios
    function calcularEdad(dia, mes, anio) {
      const fechaNacimiento = new Date(anio, mes - 1, dia); // Los meses en JavaScript son 0-indexados
      const fechaActual = new Date();

      let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      const mesActual = fechaActual.getMonth();
      const diaActual = fechaActual.getDate();

      // Ajustar la edad si la fecha actual es antes del cumpleaños de este año
      if (mesActual < (mes - 1) || (mesActual === (mes - 1) && diaActual < dia)) {
        edad--;
      }

      return edad;
    }

    const [edadMin, edadMax] = user.rango_edad.replace(/\s+/g, '').split(',').map(Number); // Eliminar espacios y dividir en números

    const usersFilters = rows
      .filter(async (perfil) =>
        calcularEdad(parseInt(perfil.nacimiento_dia), parseInt(perfil.nacimiento_mes), parseInt(perfil.nacimiento_ano)) >= edadMin &&
        calcularEdad(parseInt(perfil.nacimiento_dia), parseInt(perfil.nacimiento_mes), parseInt(perfil.nacimiento_ano)) <= edadMax // Filtro de rango de edad
      )

    const ids = usersFilters.map(user => user.id)

    //ya tengo usuarios filtrados por filtros seleccionados del usuario

    //hay que comparar la compatibilidad de los usuarios filtrados para actualizar el perfil de compatibilidad de ellos
    //y hay que comprar la compatibilidad del usuario que ejecuta la peticion con los usuarios filtrados

    //actualizar compatibilidad de los usuarios filtrados con el usuario que ejecuta la peticion, si no se ha ejecutado antes este perfil. ( perfil_user_id = bucle.perfil )

    //API PERFIL
    //actualizar perfil de usuario 
    try {

      // Creación de un objeto FormData para manejar los datos y archivos a enviar
      let data = new FormData();

      // Estos datos serán utilizados para calcular la 
      data.append('persona[nombre]', options.user.nombre);
      data.append('persona[año]', options.user.nacimiento_ano);
      data.append('persona[mes]', options.user.nacimiento_mes);
      data.append('persona[dia]', options.user.nacimiento_dia);
      data.append('persona[hora]', '2');
      data.append('persona[minuto]', '0');
      data.append('persona[ciudad]', options.user.nacimiento_ciudad ?? 'Manizales');
      data.append('persona[pais]', 'CO');
      data.append('file', fs.createReadStream('src/' + options.user.foto));

      const score = await axios.post(
        'http://localhost:5001/perfil',
        data, {
        headers: data.getHeaders() // Estableciendo los encabezados adecuados para el tipo de datos
      })

      //agregar textos a perfil de irises del usuario que esta haciendo el registro
      Iris.createItem({
        user_id: user.id,
        racional: score.data[0],
        emocional: score.data[1],
        mental: score.data[2],
        amar: score.data[3],
        autoconocimiento: score.data[4],
        espiritual: score.data[5],
        responsabilidad: score.data[6],
        autonomia: score.data[7],
      })

    } catch (e) {
      console.log('error en la peticion')
      console.log(e)
    }



    ids.forEach(async (id) => {
      if (id == undefined || id == null) return
      const otherUser = await User.getItem(id)
      //hacer consulta de compatibilidad entre usuarios
      // Creación de un objeto FormData para manejar los datos y archivos a enviar
      let data = new FormData();
      //constante random para hora y contante random para minutos
      const hora = Math.floor(Math.random() * 24) + 1;
      const minuto = Math.floor(Math.random() * 60) + 1;
      //constante random para hora y contante random para minutos
      const hora2 = Math.floor(Math.random() * 24) + 1;
      const minuto2 = Math.floor(Math.random() * 60) + 1;

      // Agregando datos de la primera persona al objeto FormData
      // Estos datos serán utilizados para calcular la compatibilidad
      data.append('persona1[nombre]', options.user.nombre);
      data.append('persona1[año]', options.user.nacimiento_ano);
      data.append('persona1[mes]', options.user.nacimiento_mes);
      data.append('persona1[dia]', options.user.nacimiento_dia);
      data.append('persona1[hora]', hora);
      data.append('persona1[minuto]', minuto);
      data.append('persona1[ciudad]', options.user.nacimiento_ciudad ?? 'Manizales');
      data.append('persona1[pais]', 'CO');

      // Agregando datos de la segunda persona de manera similar
      data.append('persona2[nombre]', otherUser.nombre);
      data.append('persona2[año]', otherUser.nacimiento_ano);
      data.append('persona2[mes]', otherUser.nacimiento_mes);
      data.append('persona2[dia]', otherUser.nacimiento_dia);
      data.append('persona2[hora]', hora2);
      data.append('persona2[minuto]', minuto2);
      data.append('persona2[ciudad]', otherUser.nacimiento_ciudad ?? 'Manizales');
      data.append('persona2[pais]', 'CO');
      data.append('file1', fs.createReadStream('src/' + options.user.foto));
      data.append('file2', fs.createReadStream('src/' + otherUser.foto));

      try {

        const score = await axios.post('http://localhost:5000/relationship_score', data, {
          headers: data.getHeaders() // Estableciendo los encabezados adecuados para el tipo de datos
        })

        await Compatibility.createOrUpdate({
          perfil_user_id: id,
          user_id: user.id,
          score: score.data.puntuacion ?? 0
        })

        await Compatibility.createOrUpdate({
          perfil_user_id: user.id,
          user_id: id,
          score: score.data.puntuacion ?? 0
        })

      } catch (e) {
        console.log('error en la peticion')
      }

    })



    return res.status(200).json(user)

  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const item = await User.updateItem(req.body)
    return res.status(200).json(item)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteItem = async (req, res, next) => {
  try {
    const item = await User.deleteItem(req.body.id)
    const response = item ? 'Registro eliminado' : 'No se pudo eliminar'
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

export const deleteAll = async (req, res, next) => {
  try {
    const response = await User.deleteAll()
    return res.status(200).json(response)
  } catch (e) {
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}

// LOGIN POST
export const login = async (req, res) => {
  try {
    const user = await User.login(req.body.email)

    if (user?.email !== req.body.email) {
      return res.status(422).json({
        message: 'Invalid Email'
      })
    }
    const passMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passMatch) {
      return res.status(422).json({
        message: 'Incorrect password'
      })
    }
    // const token = jwt.sign({ id: user.id }, env.SECRET_KEY, { expiresIn: '24h' })
    const token = jwt.sign({ id: user.id }, env.SECRET_KEY, {})
    return res.json({
      token,
      user
    })
  } catch (e) {
    console.log(e)
    const errors = e.errors ? handleSequelizeError(e) : { message: 'Error en la base de datos' }
    return res.status(409).json(errors)
  }
}
