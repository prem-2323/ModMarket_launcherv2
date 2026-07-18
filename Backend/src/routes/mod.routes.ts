import { Router } from 'express'
import * as modController from '../controllers/mod.controller'
import { authenticate } from '../middleware/auth.middleware'
import { adminOnly } from '../middleware/admin.middleware'

const router = Router()

router.get('/', modController.getAll)
router.get('/search', modController.search)
router.get('/featured', modController.getFeatured)
router.get('/trending', modController.getTrending)
router.get('/latest', modController.getLatest)
router.get('/stats', authenticate, adminOnly, modController.getStats)
router.get('/slug/:slug', modController.getBySlug)
router.get('/:id', modController.getById)

router.post('/', authenticate, adminOnly, modController.create)
router.put('/:id', authenticate, adminOnly, modController.update)
router.delete('/:id', authenticate, adminOnly, modController.remove)
router.patch('/:id/hide', authenticate, adminOnly, modController.patchHide)
router.patch('/:id/publish', authenticate, adminOnly, modController.patchPublish)
router.patch('/:id/feature', authenticate, adminOnly, modController.patchFeature)
router.post('/:id/download', modController.incrementDownload)

export default router
