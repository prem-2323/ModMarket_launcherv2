import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as authService from '../services/auth.service'

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      })
      return
    }
    if (username.length < 3) {
      res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters',
      })
      return
    }

    const result = await authService.registerUser(username, email, password)
    res.status(201).json({ success: true, ...result })
  } catch (error: any) {
    const status = error.message === 'User already exists' ? 400 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Registration failed',
    })
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
      return
    }

    const result = await authService.loginUser(email, password)
    res.json({ success: true, ...result })
  } catch (error: any) {
    const status = error.message === 'Invalid credentials' ? 401 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Login failed',
    })
  }
}

export async function profile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' })
      return
    }
    const user = await authService.getProfile(req.userId)
    res.json({ success: true, user })
  } catch (error: any) {
    const status = error.message === 'User not found' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to fetch profile',
    })
  }
}
