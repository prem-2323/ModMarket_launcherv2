const API_BASE = 'http://localhost:5000/api'

import type { Mod, Review, ModsResponse, ReviewsResponse, FavoritesResponse, FavoriteIdsResponse } from '../types'

function getToken(): string | null {
  return localStorage.getItem('mm_token')
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
    const data = await res.json()
    return data as T
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' } as T
  }
}

export function mapMod(mod: any): Mod {
  return {
    ...mod,
    id: mod._id || mod.id,
    isPremium: !mod.isFree,
    downloads: mod.downloadCount,
    reviewsCount: mod.reviewCount,
    releaseDate: mod.createdAt?.split('T')[0],
    compatibility: mod.supportedGameVersions?.join(', ') || '',
    changelog: Array.isArray(mod.changelog) && mod.changelog.length > 0 && typeof mod.changelog[0] === 'string'
      ? mod.changelog
      : mod.changelog || [],
  }
}

export const modApi = {
  async getMods(params?: Record<string, string | number | undefined>): Promise<ModsResponse> {
    const query = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.set(key, String(val))
      })
    }
    const qs = query.toString()
    return request(`/mods${qs ? `?${qs}` : ''}`)
  },

  async getAll(): Promise<ModsResponse> {
    return request('/mods')
  },

  async getMod(id: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}`)
  },

  async getModById(id: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}`)
  },

  async getModBySlug(slug: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/slug/${slug}`)
  },

  async getFeaturedMods(): Promise<{ success: boolean; mods: Mod[] }> {
    return request('/mods/featured')
  },

  async getTrendingMods(): Promise<{ success: boolean; mods: Mod[] }> {
    return request('/mods/trending')
  },

  async getLatestMods(limit = 10): Promise<{ success: boolean; mods: Mod[] }> {
    return request(`/mods/latest?limit=${limit}`)
  },

  async searchMods(q: string, params?: Record<string, string | number | undefined>): Promise<ModsResponse> {
    const query = new URLSearchParams({ q })
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.set(key, String(val))
      })
    }
    return request(`/mods/search?${query.toString()}`)
  },

  async createMod(data: Partial<Mod>): Promise<{ success: boolean; mod: Mod }> {
    return request('/mods', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateMod(id: string, data: Partial<Mod>): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteMod(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/mods/${id}`, { method: 'DELETE' })
  },

  async patchHide(id: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}/hide`, { method: 'PATCH' })
  },

  async patchPublish(id: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}/publish`, { method: 'PATCH' })
  },

  async patchFeature(id: string, featured: boolean): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    })
  },

  async incrementDownload(id: string): Promise<{ success: boolean; mod: Mod }> {
    return request(`/mods/${id}/download`, { method: 'POST' })
  },

  async getModStats(): Promise<{ success: boolean; stats: any; topDownloaded: Mod[]; topRated: Mod[] }> {
    return request('/mods/stats')
  },

  // Reviews
  async getReviews(modId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
    return request(`/reviews/${modId}?page=${page}&limit=${limit}`)
  },

  async getModReviews(modId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
    return request(`/reviews/${modId}?page=${page}&limit=${limit}`)
  },

  async createReview(
    modId: string,
    stars: number,
    comment: string
  ): Promise<{ success: boolean; review: Review; message?: string }> {
    return request(`/reviews/${modId}`, {
      method: 'POST',
      body: JSON.stringify({ stars, comment }),
    })
  },

  async updateReview(
    reviewId: string,
    stars: number,
    comment: string
  ): Promise<{ success: boolean; review: Review; message?: string }> {
    return request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ stars, comment }),
    })
  },

  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    return request(`/reviews/${reviewId}`, { method: 'DELETE' })
  },

  // Favorites
  async getFavorites(page = 1, limit = 20): Promise<FavoritesResponse> {
    return request(`/favorites?page=${page}&limit=${limit}`)
  },

  async getFavoriteIds(): Promise<FavoriteIdsResponse> {
    return request('/favorites/ids')
  },

  async checkFavorite(modId: string): Promise<{ success: boolean; isFavorited: boolean }> {
    return request(`/favorites/check/${modId}`)
  },

  async addFavorite(modId: string): Promise<{ success: boolean; favorite: any }> {
    return request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ modId }),
    })
  },

  async removeFavorite(modId: string): Promise<{ success: boolean; message: string }> {
    return request(`/favorites/${modId}`, { method: 'DELETE' })
  },
}
