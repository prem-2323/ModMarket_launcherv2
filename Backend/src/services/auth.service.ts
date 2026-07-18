import User from '../models/User'
import { generateToken } from '../utils/jwt'
import { logger } from '../utils/logger'

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; username: string; email: string } }> {
  const existing = await User.findOne({ $or: [{ email }, { username }] })
  if (existing) {
    logger.warn(`Registration failed - user already exists: ${email}`)
    throw new Error('User already exists')
  }

  const user = await User.create({ username, email, password })
  const token = generateToken(user._id.toString())

  logger.info(`User registered: ${username} (${email})`)

  return {
    token,
    user: { id: user._id.toString(), username: user.username, email: user.email },
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; username: string; email: string } }> {
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    logger.warn(`Login failed - user not found: ${email}`)
    throw new Error('Invalid credentials')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    logger.warn(`Login failed - wrong password: ${email}`)
    throw new Error('Invalid credentials')
  }

  const token = generateToken(user._id.toString())
  logger.info(`User logged in: ${user.username} (${email})`)

  return {
    token,
    user: { id: user._id.toString(), username: user.username, email: user.email },
  }
}

export async function getProfile(userId: string): Promise<{
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  createdAt: Date
}> {
  const user = await User.findById(userId).select('-password')
  if (!user) throw new Error('User not found')

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export async function updateProfile(
  userId: string,
  updates: { username?: string; avatar?: string }
): Promise<{
  id: string
  username: string
  email: string
  avatar?: string
  role: string
}> {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('-password')

  if (!user) throw new Error('User not found')

  logger.info(`Profile updated for user: ${user.username}`)

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  }
}
