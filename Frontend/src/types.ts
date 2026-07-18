export interface Mod {
  _id: string;
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  author: string;
  game?: string;
  category: string;
  tags: string[];
  version: string;
  supportedGameVersions: string[];
  thumbnail: string;
  screenshots: string[];
  price: number;
  currency: string;
  isFree: boolean;
  isPremium?: boolean;
  discount?: number;
  discountPrice?: number;
  featured: boolean;
  status: string;
  downloadCount: number;
  downloads?: number;
  views?: number;
  purchasesCount?: number;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  fileSize: string;
  shareModsUrl?: string;
  dependencies: string[];
  changelog: string[] | { version: string; date: string; changes: string[] }[];
  features: string[];
  compatibility?: string;
  requiredDLC: string[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstalledMod extends Mod {
  enabled: boolean;
  priority: number;
  installDate: string;
  isUpdating?: boolean;
}

export interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  speed: string;
  remainingTime: string;
  totalSize: string;
  downloadedSize: string;
  status: 'downloading' | 'paused' | 'queued' | 'completed' | 'cancelled';
}

export interface Purchase {
  id: string;
  modId: string;
  modTitle: string;
  price: number;
  date: string;
  paymentMethod: 'Google Pay' | 'UPI' | 'PhonePe' | 'Card';
  status: 'Success' | 'Refunded' | 'Pending';
  invoiceNo: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'download';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  iconName: string;
  maxProgress?: number;
  currentProgress?: number;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  mod: string;
  stars: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  mod: Mod;
  createdAt: string;
}

export interface ModsResponse {
  success: boolean;
  mods: Mod[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ModResponse {
  success: boolean;
  mod: Mod;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FavoritesResponse {
  success: boolean;
  favorites: Favorite[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FavoriteIdsResponse {
  success: boolean;
  favoriteIds: string[];
}

export type Page = 'dashboard' | 'store' | 'library' | 'downloads' | 'payments' | 'profile' | 'settings' | 'favorites' | 'admin';
