import Mod, { IMod } from '../models/Mod'
import { paginate } from '../utils/pagination'
import { buildSearchFilter } from '../utils/search'

interface QueryParams {
  page?: number
  limit?: number
  category?: string
  game?: string
  isFree?: string
  author?: string
  sort?: string
  q?: string
  search?: string
  featured?: string
  status?: string
  minPrice?: string
  maxPrice?: string
  tag?: string
  version?: string
}

export async function getAllMods(params: QueryParams) {
  const { page = 1, limit = 20, category, game, isFree, author, sort, q, search, featured, status, minPrice, maxPrice, tag, version: gameVersion } = params
  const { skip, page: p, limit: l } = paginate(Number(page), Number(limit))

  const filter: Record<string, unknown> = { status: 'Published' }

  if (status) {
    filter.status = status
  }

  if (search || q) {
    const query = (search || q) as string
    Object.assign(filter, buildSearchFilter(query, ['title', 'description', 'author', 'tags', 'shortDescription']))
  }

  if (category) {
    filter.category = category
  }
  if (game) {
    filter.game = game
  }
  if (isFree === 'true') {
    filter.isFree = true
  } else if (isFree === 'false') {
    filter.isFree = false
  }
  if (author) {
    filter.author = { $regex: author, $options: 'i' }
  }
  if (featured === 'true') {
    filter.featured = true
  }
  if (tag) {
    filter.tags = tag
  }
  if (gameVersion) {
    filter.supportedGameVersions = gameVersion
  }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) (filter.price as Record<string, unknown>).$gte = Number(minPrice)
    if (maxPrice) (filter.price as Record<string, unknown>).$lte = Number(maxPrice)
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 }
      break
    case 'oldest':
      sortOption = { createdAt: 1 }
      break
    case 'downloads':
      sortOption = { downloadCount: -1 }
      break
    case 'rating':
      sortOption = { rating: -1 }
      break
    case 'price':
    case 'price_asc':
      sortOption = { price: 1 }
      break
    case 'price_desc':
      sortOption = { price: -1 }
      break
    case 'alphabetical':
      sortOption = { title: 1 }
      break
    default:
      sortOption = { createdAt: -1 }
  }

  const [mods, total] = await Promise.all([
    Mod.find(filter).sort(sortOption).skip(skip).limit(l).lean(),
    Mod.countDocuments(filter),
  ])

  return {
    mods,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export async function getModById(id: string) {
  const mod = await Mod.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean()
  return mod
}

export async function getModBySlug(slug: string) {
  const mod = await Mod.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).lean()
  return mod
}

export async function getFeaturedMods() {
  const mods = await Mod.find({ featured: true, status: 'Published' })
    .sort({ downloadCount: -1 })
    .limit(10)
    .lean()
  return mods
}

export async function getTrendingMods() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const mods = await Mod.aggregate([
    { $match: { status: 'Published' } },
    {
      $addFields: {
        trendingScore: {
          $add: [
            { $multiply: ['$downloadCount', 0.4] },
            { $multiply: [{ $ifNull: ['$rating', 0] }, 0.3] },
            { $multiply: ['$views', 0.2] },
            { $multiply: ['$reviewCount', 0.1] },
          ],
        },
      },
    },
    { $sort: { trendingScore: -1 } },
    { $limit: 10 },
  ])
  return mods
}

export async function getLatestMods(limit = 10) {
  const mods = await Mod.find({ status: 'Published' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
  return mods
}

export async function createMod(data: Partial<IMod>) {
  const mod = new Mod(data)
  await mod.save()
  return mod.toObject()
}

export async function updateMod(id: string, data: Partial<IMod>) {
  const mod = await Mod.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
  return mod
}

export async function deleteMod(id: string) {
  const mod = await Mod.findByIdAndDelete(id)
  return mod
}

export async function getModStats() {
  const stats = await Mod.aggregate([
    { $group: { _id: null, totalMods: { $sum: 1 }, totalDownloads: { $sum: '$downloadCount' }, totalViews: { $sum: '$views' }, totalPurchases: { $sum: '$purchasesCount' }, avgRating: { $avg: '$rating' } } },
  ])
  return stats[0] || { totalMods: 0, totalDownloads: 0, totalViews: 0, totalPurchases: 0, avgRating: 0 }
}

export async function getTopDownloaded(limit = 10) {
  return Mod.find({ status: 'Published' }).sort({ downloadCount: -1 }).limit(limit).lean()
}

export async function getTopRated(limit = 10) {
  return Mod.find({ status: 'Published' }).sort({ rating: -1, reviewCount: -1 }).limit(limit).lean()
}
