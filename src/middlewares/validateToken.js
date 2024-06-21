import jwt from 'jsonwebtoken'
export const validateToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Token de seguridad no proporcionado.' })
    }

    const token = authorizationHeader.split(' ')[1]

    // Verificar el token
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({ mensaje: 'Token de seguridad inválido.' })
      }
      // Pasar el token decodificado a las rutas protegidas
      req.usuario = decoded
      next()
    })
  } catch (err) {
    console.log(err)
  }
}
