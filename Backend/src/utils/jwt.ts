import jwt from 'jsonwebtoken'
import { config } from '../config/env'

export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: '7d',
  } as jwt.SignOptions)
}

export function verifyToken(token: string): { id: string } {
  return jwt.verify(token, config.jwtSecret) as { id: string }
}
