import Favorite from '../models/Favorite'
import { paginate } from '../utils/pagination'

export async function getUserFavorites(userId: string, page = 1, limit = 20) {
  const { skip, page: p, limit: l } = paginate(page, limit)
  const [favorites, total] = await Promise.all([
    Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate('mod')
      .lean(),
    Favorite.countDocuments({ user: userId }),
  ])
  return {
    favorites,
    pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) },
  }
}

export async function addFavorite(userId: string, modId: string) {
  const existing = await Favorite.findOne({ user: userId, mod: modId })
  if (existing) {
    throw new Error('Mod already in favorites')
  }
  const favorite = new Favorite({ user: userId, mod: modId })
  await favorite.save()
  return favorite.populate('mod')
}

export async function removeFavorite(userId: string, modId: string) {
  const result = await Favorite.findOneAndDelete({ user: userId, mod: modId })
  if (!result) {
    throw new Error('Favorite not found')
  }
  return result
}

export async function isFavorited(userId: string, modId: string) {
  const fav = await Favorite.findOne({ user: userId, mod: modId })
  return !!fav
}

export async function getFavoriteIds(userId: string) {
  const favs = await Favorite.find({ user: userId }).select('mod').lean()
  return favs.map((f) => f.mod.toString())
}
