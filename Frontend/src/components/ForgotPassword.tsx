import React, { useState } from 'react'
import { Gamepad2, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'

interface ForgotPasswordProps {
  onBack: () => void
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await api.forgotPassword(email)
    if (res.success) {
      setSuccess(true)
    } else {
      setError(res.message || 'Failed to send reset email')
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
              Reset your password
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">
                If an account with that email exists, a password reset link has been sent.
                Check your inbox (and spam folder).
              </p>
              <button
                onClick={onBack}
                className="text-xs text-[#12CFCE] hover:text-[#12CFCE]/80 transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your email"
                    className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
                    required
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
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-xs text-[#94A3B8] hover:text-[#12CFCE] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
