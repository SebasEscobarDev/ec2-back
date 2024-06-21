import Sequelize from 'sequelize'
import { env } from '../environment.js'

export const sequelize = new Sequelize(
  env.DB_DATABASE,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: 'mysql',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
)
