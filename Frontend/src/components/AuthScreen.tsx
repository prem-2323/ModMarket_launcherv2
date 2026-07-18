import React, { useState } from 'react'
import { Gamepad2, Mail, Lock, User, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { api } from '../services/api'

export type AuthPage = 'login' | 'register' | 'forgot-password' | 'verify-email' | 'reset-password'

interface AuthScreenProps {
  onAuthSuccess: () => void
  onNavigate: (page: AuthPage) => void
}

export default function AuthScreen({ onAuthSuccess, onNavigate }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const success = await api.loginAndSave(email, password)
        if (success) {
          onAuthSuccess()
        } else {
          const res = await api.login(email, password)
          setError(res.message || 'Login failed')
        }
      } else {
        const res = await api.register(username, email, password)
        if (res.success && res.token) {
          api.logout()
          setRegistered(true)
        } else {
          setError(res.message || 'Registration failed')
        }
      }
    } catch {
      setError('Connection error. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,207,206,0.08),transparent_70%)]" />
        <div className="relative w-full max-w-md">
          <div className="bg-[#151D30]/80 border border-[#232F4C] rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B0F19] border border-[#12CFCE]/20 shadow-[0_0_20px_rgba(18,207,206,0.15)] mb-4 mx-auto">
              <Gamepad2 className="w-7 h-7 text-[#12CFCE]" />
            </div>
            <h2 className="text-lg font-black text-[#FFFFFF] mb-2">
              Account Created
            </h2>
            <p className="text-xs text-[#94A3B8] mb-6">
              A verification link has been sent to <strong className="text-[#12CFCE]">{email}</strong>.<br />
              Check your inbox (and spam folder) to activate your account.
            </p>
            <button
              onClick={() => { setIsLogin(true); setRegistered(false) }}
              className="px-6 py-3 bg-[#12CFCE] hover:bg-[#12CFCE]/90 text-[#0B0F19] font-black text-sm rounded-xl transition-all duration-300 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,207,206,0.08),transparent_70%)]" />

      <div className="relative w-full max-w-md">
        <div className="bg-[#151D30]/80 border border-[#232F4C] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B0F19] border border-[#12CFCE]/20 shadow-[0_0_20px_rgba(18,207,206,0.15)] mb-4">
              <Gamepad2 className="w-7 h-7 text-[#12CFCE]" />
            </div>
            <h1 className="text-2xl font-black text-[#FFFFFF] tracking-tight">
              Mod<span className="text-[#12CFCE]">Market</span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
                    required
                    minLength={3}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[10px] text-[#94A3B8] hover:text-[#12CFCE] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl text-xs text-[#EF4444]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#12CFCE] hover:bg-[#12CFCE]/90 text-[#0B0F19] font-black text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-xs text-[#94A3B8] hover:text-[#12CFCE] transition-colors cursor-pointer"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-[#12CFCE] font-bold">Register</span></>
              ) : (
                <>Already have an account? <span className="text-[#12CFCE] font-bold">Sign In</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
