import mongoose, { Schema, Document } from 'mongoose'
import { hashPassword, comparePassword } from '../utils/password'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hashPassword(this.password)
  next()
})

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return comparePassword(password, this.password)
}

export default mongoose.model<IUser>('User', userSchema)
