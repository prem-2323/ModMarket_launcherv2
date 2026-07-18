export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface UpdateProfileInput {
  username?: string
  avatar?: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    username: string
    email: string
  }
  message?: string
}

export interface UserResponse {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  isVerified: boolean
  createdAt: Date
}

export interface VerifyEmailInput {
  token: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}
