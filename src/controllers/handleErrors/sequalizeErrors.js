import { Sequelize } from 'sequelize'

// Función genérica para manejar errores de Sequelize
export const handleSequelizeError = (e) => {
  const errors = e.errors.map(err => {
    return {
      type: err.type ?? 'SequelizeError',
      message: err.message ?? 'Error en la base de datos',
      path: err.path ?? '',
      value: err.value ?? '',
      validatorKey: err.validatorKey ?? ''
    }
  })
  return errors
}
