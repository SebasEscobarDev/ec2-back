import { config as dotenv } from 'dotenv'
dotenv()
// DOTENV PARA LEER VARIABLES GLOBALES .ENV
export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_DATABASE: process.env.DB_DATABASE || 'kimik_red',
  APP_PORT: process.env.APP_PORT || '8000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://192.168.20.15:3000'],
  SECRET_KEY: process.env.SECRET_KEY || '',
  DB_SYNC: process.env.DB_SYNC || false,
}
