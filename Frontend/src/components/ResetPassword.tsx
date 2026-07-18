import React, { useState } from 'react'
import { Gamepad2, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'

interface ResetPasswordProps {
  token: string
  onSuccess: () => void
}

export default function ResetPassword({ token, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const res = await api.resetPassword(token, password)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.message || 'Password reset failed')
    }

    setLoading(false)
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
              Choose a new password
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={onSuccess}
                className="px-6 py-3 bg-[#12CFCE] hover:bg-[#12CFCE]/90 text-[#0B0F19] font-black text-sm rounded-xl transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

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
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
