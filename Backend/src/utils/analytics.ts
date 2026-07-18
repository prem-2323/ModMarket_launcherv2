import Mod from '../models/Mod'
import Review from '../models/Review'
import Favorite from '../models/Favorite'
import User from '../models/User'

export async function getDashboardAnalytics() {
  const [modStats, totalUsers, totalFavorites, totalReviews] = await Promise.all([
    Mod.aggregate([
      { $group: { _id: null, totalMods: { $sum: 1 }, totalDownloads: { $sum: '$downloadCount' }, totalViews: { $sum: '$views' }, totalPurchases: { $sum: '$purchasesCount' }, avgRating: { $avg: '$rating' } } },
    ]),
    User.countDocuments({ role: 'user' }),
    Favorite.countDocuments(),
    Review.countDocuments(),
  ])

  return {
    totalMods: modStats[0]?.totalMods || 0,
    totalDownloads: modStats[0]?.totalDownloads || 0,
    totalViews: modStats[0]?.totalViews || 0,
    totalPurchases: modStats[0]?.totalPurchases || 0,
    avgRating: Math.round((modStats[0]?.avgRating || 0) * 10) / 10,
    totalUsers,
    totalFavorites,
    totalReviews,
  }
}

export async function getTopModsByCategory(limit = 5) {
  return Mod.aggregate([
    { $match: { status: 'Published' } },
    { $group: { _id: '$category', mods: { $push: { title: '$title', downloadCount: '$downloadCount', rating: '$rating', slug: '$slug', thumbnail: '$thumbnail' } }, totalDownloads: { $sum: '$downloadCount' } } },
    { $sort: { totalDownloads: -1 } },
    { $limit: limit },
  ])
}

export async function getDailyActiveUsers(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  return User.countDocuments({ lastLogin: { $gte: since } })
}
