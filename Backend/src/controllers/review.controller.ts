import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as reviewService from '../services/review.service'

export async function getByMod(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await reviewService.getReviewsByModId(req.params.modId, req.query)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stars, comment } = req.body
    if (!stars || stars < 1 || stars > 5) {
      res.status(400).json({ success: false, message: 'Stars must be between 1 and 5' })
      return
    }

    const review = await reviewService.createReview(
      req.userId!,
      req.params.modId,
      stars,
      comment || ''
    )
    res.status(201).json({ success: true, review })
  } catch (err: any) {
    if (err.message === 'You have already reviewed this mod') {
      res.status(400).json({ success: false, message: err.message })
      return
    }
    next(err)
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stars, comment } = req.body
    const review = await reviewService.updateReview(req.params.reviewId, req.userId!, stars, comment)
    res.json({ success: true, review })
  } catch (err: any) {
    if (err.message === 'Review not found or not authorized') {
      res.status(404).json({ success: false, message: err.message })
      return
    }
    next(err)
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await reviewService.deleteReview(req.params.reviewId, req.userId!)
    res.json({ success: true, message: 'Review deleted' })
  } catch (err: any) {
    if (err.message === 'Review not found' || err.message === 'Not authorized to delete this review') {
      res.status(400).json({ success: false, message: err.message })
      return
    }
    next(err)
  }
}
