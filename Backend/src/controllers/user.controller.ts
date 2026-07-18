import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as authService from '../services/auth.service'

export async function updateProfile(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' })
      return
    }

    const { username, avatar } = req.body

    if (username && username.length < 3) {
      res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters',
      })
      return
    }

    const updates: { username?: string; avatar?: string } = {}
    if (username !== undefined) updates.username = username
    if (avatar !== undefined) updates.avatar = avatar

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No fields to update',
      })
      return
    }

    const user = await authService.updateProfile(req.userId, updates)
    res.json({ success: true, user })
  } catch (error: any) {
    const status = error.message === 'User not found' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update profile',
    })
  }
}
