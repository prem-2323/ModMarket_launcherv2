import nodemailer from 'nodemailer'
import { config } from '../config/env'
import { logger } from './logger'

let transporter: nodemailer.Transporter | null = null

export async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter

  if (config.smtp.host) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    })
    logger.info('SMTP transporter configured')
  } else {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    })
    logger.info(`Ethereal email account created: ${testAccount.user}`)
  }

  return transporter
}

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const t = await getTransporter()
  const url = `${config.clientUrl}/verify-email?token=${token}`

  const info = await t.sendMail({
    from: '"ModMarket" <noreply@modmarket.app>',
    to,
    subject: 'Verify your ModMarket account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0B0F19;color:#FFFFFF;border-radius:16px">
        <h1 style="color:#12CFCE;font-size:24px;margin:0 0 8px">ModMarket</h1>
        <p style="color:#94A3B8;font-size:14px">Thanks for signing up! Click below to activate your account.</p>
        <a href="${url}" style="display:inline-block;margin:20px 0;padding:12px 32px;background:#12CFCE;color:#0B0F19;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px">
          Verify Email
        </a>
        <p style="color:#64748B;font-size:12px">Or paste this link in your browser:<br><code style="color:#12CFCE;word-break:break-all">${url}</code></p>
        <hr style="border-color:#232F4C;margin:20px 0">
        <p style="color:#64748B;font-size:11px">If you didn't create an account, ignore this email.</p>
      </div>
    `,
  })

  logger.info(`Verification email sent to ${to}`)
  if (info.messageId) {
    const preview = nodemailer.getTestMessageUrl(info)
    if (preview) logger.info(`Preview URL: ${preview}`)
  }
}

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const t = await getTransporter()
  const url = `${config.clientUrl}/reset-password?token=${token}`

  const info = await t.sendMail({
    from: '"ModMarket" <noreply@modmarket.app>',
    to,
    subject: 'Reset your ModMarket password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0B0F19;color:#FFFFFF;border-radius:16px">
        <h1 style="color:#12CFCE;font-size:24px;margin:0 0 8px">ModMarket</h1>
        <p style="color:#94A3B8;font-size:14px">We received a request to reset your password. Click below to set a new one.</p>
        <a href="${url}" style="display:inline-block;margin:20px 0;padding:12px 32px;background:#12CFCE;color:#0B0F19;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px">
          Reset Password
        </a>
        <p style="color:#64748B;font-size:12px">Or paste this link in your browser:<br><code style="color:#12CFCE;word-break:break-all">${url}</code></p>
        <p style="color:#64748B;font-size:11px">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        <hr style="border-color:#232F4C;margin:20px 0">
        <p style="color:#64748B;font-size:11px">If you didn't request a password reset, no changes will be made.</p>
      </div>
    `,
  })

  logger.info(`Password reset email sent to ${to}`)
  if (info.messageId) {
    const preview = nodemailer.getTestMessageUrl(info)
    if (preview) logger.info(`Preview URL: ${preview}`)
  }
}
