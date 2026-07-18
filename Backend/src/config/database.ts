import mongoose from 'mongoose'
import { config } from './env'

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    console.log('MongoDB connected successfully')
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn('MongoDB connection failed; continuing without database:', msg)
  }
}
