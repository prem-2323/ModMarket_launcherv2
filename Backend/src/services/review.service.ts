import Review from '../models/Review'
import Mod from '../models/Mod'
import { paginate } from '../utils/pagination'

export async function getReviewsByModId(modId: string, params: any = {}) {
  const { page = 1, limit = 10 } = params
  const { skip, page: p, limit: l } = paginate(Number(page), Number(limit))
  const [reviews, total] = await Promise.all([
    Review.find({ mod: modId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('user', 'username avatar')
      .lean(),
    Review.countDocuments({ mod: modId }),
  ])

  return {
    reviews,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export async function createReview(
  userId: string,
  modId: string,
  stars: number,
  comment: string
) {
  const existing = await Review.findOne({ user: userId, mod: modId })
  if (existing) {
    throw new Error('You have already reviewed this mod')
  }

  const review = new Review({ user: userId, mod: modId, stars, comment })
  await review.save()

  await recalculateModRating(modId)

  return review.populate('user', 'username avatar')
}

export async function updateReview(reviewId: string, userId: string, stars: number, comment: string) {
  const review = await Review.findOne({ _id: reviewId, user: userId })
  if (!review) {
    throw new Error('Review not found or not authorized')
  }

  if (stars !== undefined) review.stars = stars
  if (comment !== undefined) review.comment = comment
  await review.save()

  await recalculateModRating(review.mod.toString())

  return review.populate('user', 'username avatar')
}

export async function deleteReview(reviewId: string, userId: string) {
  const review = await Review.findById(reviewId)
  if (!review) {
    throw new Error('Review not found')
  }
  if (review.user.toString() !== userId) {
    throw new Error('Not authorized to delete this review')
  }

  const modId = review.mod
  await Review.findByIdAndDelete(reviewId)

  await recalculateModRating(modId.toString())
}

async function recalculateModRating(modId: string) {
  const stats = await Review.aggregate([
    { $match: { mod: modId as any } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$stars' },
        count: { $sum: 1 },
        star5: { $sum: { $cond: [{ $eq: ['$stars', 5] }, 1, 0] } },
        star4: { $sum: { $cond: [{ $eq: ['$stars', 4] }, 1, 0] } },
        star3: { $sum: { $cond: [{ $eq: ['$stars', 3] }, 1, 0] } },
        star2: { $sum: { $cond: [{ $eq: ['$stars', 2] }, 1, 0] } },
        star1: { $sum: { $cond: [{ $eq: ['$stars', 1] }, 1, 0] } },
      },
    },
  ])

  if (stats.length > 0) {
    await Mod.findByIdAndUpdate(modId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].count,
      ratingBreakdown: {
        5: stats[0].star5,
        4: stats[0].star4,
        3: stats[0].star3,
        2: stats[0].star2,
        1: stats[0].star1,
      },
    })
  } else {
    await Mod.findByIdAndUpdate(modId, {
      rating: 0,
      reviewCount: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    })
  }
}
