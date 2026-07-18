import { Router } from 'express'
import * as reviewController from '../controllers/review.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/mod/:modId', reviewController.getByMod)
router.get('/:modId', reviewController.getByMod)
router.post('/mod/:modId', authenticate, reviewController.create)
router.post('/:modId', authenticate, reviewController.create)
router.put('/:reviewId', authenticate, reviewController.update)
router.delete('/:reviewId', authenticate, reviewController.remove)

export default router
