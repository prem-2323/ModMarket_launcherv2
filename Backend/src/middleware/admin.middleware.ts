import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import User from '../models/User'

export async function adminOnly(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Authentication required' })
      return
    }

    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' })
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}
