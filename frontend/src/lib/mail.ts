// utils/sendOtpEmail.ts

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * 6 оронтой OTP generate
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Email OTP илгээх
 */
export async function sendOtpEmail(email: string, otp: string) {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your verification code',
      html: `
        <div style="font-family:sans-serif">
          <h2>Email Verification</h2>
          
          <p>Your OTP code is:</p>

          <div
            style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:6px;
              margin:20px 0;
            "
          >
            ${otp}
          </div>

          <p>
            This code will expire in 5 minutes.
          </p>
        </div>
      `,
    })

    return response
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}
