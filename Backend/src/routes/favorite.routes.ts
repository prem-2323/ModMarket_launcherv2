import { Router } from 'express'
import * as favoriteController from '../controllers/favorite.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, favoriteController.getAll)
router.get('/ids', authenticate, favoriteController.getIds)
router.get('/check/:modId', authenticate, favoriteController.check)
router.post('/', authenticate, favoriteController.add)
router.delete('/:modId', authenticate, favoriteController.remove)

export default router
