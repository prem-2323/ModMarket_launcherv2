import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as modService from '../services/mod.service'

export async function getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await modService.getAllMods(req.query as any)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export async function getFeatured(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mods = await modService.getFeaturedMods()
    res.json({ success: true, mods })
  } catch (err) {
    next(err)
  }
}

export async function getTrending(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mods = await modService.getTrendingMods()
    res.json({ success: true, mods })
  } catch (err) {
    next(err)
  }
}

export async function getLatest(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Number(_req.query.limit) || 10
    const mods = await modService.getLatestMods(limit)
    res.json({ success: true, mods })
  } catch (err) {
    next(err)
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.getModById(req.params.id)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function getBySlug(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.getModBySlug(req.params.slug)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function search(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await modService.getAllMods({ ...req.query as any, q: req.query.q as string })
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.createMod({ ...req.body, authorId: req.userId })
    res.status(201).json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.updateMod(req.params.id, req.body)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.deleteMod(req.params.id)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, message: 'Mod deleted' })
  } catch (err) {
    next(err)
  }
}

export async function patchHide(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.updateMod(req.params.id, { status: 'Hidden' } as any)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function patchPublish(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.updateMod(req.params.id, { status: 'Published' } as any)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function patchFeature(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.updateMod(req.params.id, { featured: req.body.featured } as any)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}

export async function getStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await modService.getModStats()
    const topDownloaded = await modService.getTopDownloaded()
    const topRated = await modService.getTopRated()
    res.json({ success: true, stats, topDownloaded, topRated })
  } catch (err) {
    next(err)
  }
}

export async function incrementDownload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const mod = await modService.updateMod(req.params.id, { $inc: { downloadCount: 1 } } as any)
    if (!mod) {
      res.status(404).json({ success: false, message: 'Mod not found' })
      return
    }
    res.json({ success: true, mod })
  } catch (err) {
    next(err)
  }
}
