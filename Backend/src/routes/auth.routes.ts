import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/profile', authenticate, authController.profile)
router.post('/verify-email', authController.verifyEmailHandler)
router.post('/forgot-password', authController.forgotPasswordHandler)
router.post('/reset-password', authController.resetPasswordHandler)

export default router
