import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { adminOnly } from '../middleware/admin.middleware'
import { getDashboardAnalytics, getTopModsByCategory } from '../utils/analytics'
import Mod from '../models/Mod'

const router = Router()

router.get('/analytics', authenticate, adminOnly, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await getDashboardAnalytics()
    const topByCategory = await getTopModsByCategory()
    const [topDownloaded, topRated, recentMods] = await Promise.all([
      Mod.find({ status: 'Published' }).sort({ downloadCount: -1 }).limit(10).select('title downloadCount rating slug thumbnail').lean(),
      Mod.find({ status: 'Published' }).sort({ rating: -1 }).limit(10).select('title rating reviewCount slug thumbnail').lean(),
      Mod.find({ status: 'Published' }).sort({ createdAt: -1 }).limit(10).select('title createdAt slug thumbnail').lean(),
    ])
    res.json({ success: true, analytics, topByCategory, topDownloaded, topRated, recentMods })
  } catch (err) {
    next(err)
  }
})

export default router
