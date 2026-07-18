import crypto from 'crypto'
import User from '../models/User'
import { generateToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email'

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

  const verificationToken = crypto.randomBytes(32).toString('hex')
  const user = await User.create({ username, email, password, verificationToken })

  sendVerificationEmail(email, verificationToken).catch((err) =>
    logger.error('Failed to send verification email', err)
  )

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
  isVerified: boolean
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
    isVerified: user.isVerified,
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

export async function verifyEmail(
  token: string
): Promise<{ message: string }> {
  const user = await User.findOne({ verificationToken: token })
  if (!user) {
    throw new Error('Invalid or expired verification token')
  }

  user.isVerified = true
  user.verificationToken = undefined
  await user.save()

  logger.info(`Email verified for user: ${user.email}`)
  return { message: 'Email verified successfully' }
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const user = await User.findOne({ email })
  if (!user) {
    logger.warn(`Password reset requested for unknown email: ${email}`)
    return { message: 'If an account with that email exists, a reset link has been sent' }
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = resetToken
  user.resetPasswordExpires = new Date(Date.now() + 3600000)
  await user.save()

  sendPasswordResetEmail(email, resetToken).catch((err) =>
    logger.error('Failed to send password reset email', err)
  )

  logger.info(`Password reset email sent to: ${email}`)
  return { message: 'If an account with that email exists, a reset link has been sent' }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+password')

  if (!user) {
    throw new Error('Invalid or expired reset token')
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  logger.info(`Password reset successful for user: ${user.email}`)
  return { message: 'Password reset successfully' }
}
