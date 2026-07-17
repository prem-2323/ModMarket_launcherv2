export interface Mod {
  id: string;
  title: string;
  tagline: string;
  category: 'map' | 'graphics' | 'trailers' | 'physics' | 'sounds' | 'truck';
  isPremium: boolean;
  price: number; // 0 for free
  downloads: number;
  rating: number; // 1-5
  author: string;
  version: string;
  fileSize: string;
  releaseDate: string;
  thumbnail: string;
  screenshots: string[];
  description: string;
  features: string[];
  compatibility: string;
  requiredDLC: string[];
  dependencies: string[];
  reviewsCount: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface InstalledMod extends Mod {
  enabled: boolean;
  priority: number; // lower number = higher priority
  installDate: string;
  isUpdating?: boolean;
}

export interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  progress: number; // 0-100
  speed: string; // e.g. "45.2 MB/s"
  remainingTime: string; // e.g. "12s"
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

export type Page = 'dashboard' | 'store' | 'library' | 'downloads' | 'payments' | 'profile' | 'settings';
