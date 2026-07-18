import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.put('/profile', authenticate, userController.updateProfile)

export default router
