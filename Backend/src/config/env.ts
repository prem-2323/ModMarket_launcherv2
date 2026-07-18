import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  mongodbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/modmarket',
  jwtSecret: process.env.JWT_SECRET || 'modmarket_jwt_secret_key_2026',
  jwtExpiresIn: '7d',
}
