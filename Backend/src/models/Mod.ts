import mongoose, { Schema, Document } from 'mongoose'

export interface IMod extends Document {
  title: string
  slug: string
  shortDescription: string
  description: string
  author: string
  authorId?: mongoose.Types.ObjectId
  game: 'ETS2' | 'ATS'
  category: string
  tags: string[]
  version: string
  supportedGameVersions: string[]
  thumbnail: string
  screenshots: string[]
  price: number
  currency: string
  isFree: boolean
  discount?: number
  discountPrice?: number
  featured: boolean
  status: 'Draft' | 'Published' | 'Hidden'
  downloadCount: number
  views: number
  purchasesCount: number
  rating: number
  reviewCount: number
  fileSize: string
  shareModsUrl?: string
  dependencies: string[]
  changelog: string[]
  features: string[]
  requiredDLC: string[]
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  createdAt: Date
  updatedAt: Date
}

const modSchema = new Schema<IMod>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    game: { type: String, enum: ['ETS2', 'ATS'], required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    version: { type: String, required: true },
    supportedGameVersions: [{ type: String }],
    thumbnail: { type: String, default: '' },
    screenshots: [{ type: String }],
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    isFree: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    discountPrice: { type: Number },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['Draft', 'Published', 'Hidden'], default: 'Published' },
    downloadCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    purchasesCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    fileSize: { type: String, default: '' },
    shareModsUrl: { type: String },
    dependencies: [{ type: String }],
    changelog: [{ type: String }],
    features: [{ type: String }],
    requiredDLC: [{ type: String }],
    ratingBreakdown: {
      type: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
      default: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  },
  { timestamps: true }
)

modSchema.index({ title: 'text', author: 'text', shortDescription: 'text', description: 'text', tags: 'text' })
modSchema.index({ category: 1, game: 1, isFree: 1, status: 1 })
modSchema.index({ downloadCount: -1 })
modSchema.index({ rating: -1 })
modSchema.index({ createdAt: -1 })
modSchema.index({ featured: 1, status: 1 })

export default mongoose.model<IMod>('Mod', modSchema)
