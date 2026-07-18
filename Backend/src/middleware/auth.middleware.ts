import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
  userId?: string
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    logger.warn('Unauthorized access attempt - missing token')
    res.status(401).json({ success: false, message: 'Authentication required' })
    return
  }

  const token = header.replace('Bearer ', '')

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.id
    next()
  } catch {
    logger.warn('Unauthorized access attempt - invalid token')
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}
