import React, { useEffect, useState } from 'react'
import { Gamepad2, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { api } from '../services/api'

interface VerifyEmailProps {
  token: string
  onSuccess: () => void
}

export default function VerifyEmail({ token, onSuccess }: VerifyEmailProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      const res = await api.verifyEmail(token)
      if (res.success) {
        setStatus('success')
        setMessage(res.message || 'Email verified successfully')
      } else {
        setStatus('error')
        setMessage(res.message || 'Verification failed')
      }
    }
    verify()
  }, [token])

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
          </div>

          <div className="text-center py-8">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-[#12CFCE] animate-spin" />
                <p className="text-sm text-[#94A3B8]">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
                <p className="text-sm text-[#94A3B8]">{message}</p>
                <button
                  onClick={onSuccess}
                  className="mt-4 px-6 py-3 bg-[#12CFCE] hover:bg-[#12CFCE]/90 text-[#0B0F19] font-black text-sm rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="w-12 h-12 text-[#EF4444]" />
                <p className="text-sm text-[#EF4444]">{message}</p>
                <button
                  onClick={onSuccess}
                  className="mt-4 text-xs text-[#94A3B8] hover:text-[#12CFCE] transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
