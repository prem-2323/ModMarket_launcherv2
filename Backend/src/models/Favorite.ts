import mongoose, { Schema, Document } from 'mongoose'

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId
  mod: mongoose.Types.ObjectId
  createdAt: Date
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mod: { type: Schema.Types.ObjectId, ref: 'Mod', required: true },
  },
  { timestamps: true }
)

favoriteSchema.index({ user: 1, mod: 1 }, { unique: true })
favoriteSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model<IFavorite>('Favorite', favoriteSchema)
