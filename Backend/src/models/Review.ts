import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  mod: mongoose.Types.ObjectId
  stars: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mod: { type: Schema.Types.ObjectId, ref: 'Mod', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
)

reviewSchema.index({ mod: 1, createdAt: -1 })
reviewSchema.index({ user: 1, mod: 1 }, { unique: true })

export default mongoose.model<IReview>('Review', reviewSchema)
