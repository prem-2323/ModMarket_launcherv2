import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as favoriteService from '../services/favorite.service'

export async function getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await favoriteService.getUserFavorites(req.userId!, Number(req.query.page) || 1, Number(req.query.limit) || 20)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export async function add(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { modId } = req.body
    if (!modId) {
      res.status(400).json({ success: false, message: 'modId is required' })
      return
    }
    const favorite = await favoriteService.addFavorite(req.userId!, modId)
    res.status(201).json({ success: true, favorite })
  } catch (err: any) {
    if (err.message === 'Mod already in favorites') {
      res.status(400).json({ success: false, message: err.message })
      return
    }
    next(err)
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { modId } = req.params
    await favoriteService.removeFavorite(req.userId!, modId)
    res.json({ success: true, message: 'Favorite removed' })
  } catch (err: any) {
    if (err.message === 'Favorite not found') {
      res.status(404).json({ success: false, message: err.message })
      return
    }
    next(err)
  }
}

export async function check(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const isFav = await favoriteService.isFavorited(req.userId!, req.params.modId)
    res.json({ success: true, isFavorited: isFav })
  } catch (err) {
    next(err)
  }
}

export async function getIds(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const ids = await favoriteService.getFavoriteIds(req.userId!)
    res.json({ success: true, favoriteIds: ids })
  } catch (err) {
    next(err)
  }
}
