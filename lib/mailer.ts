import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.EMAIL_FROM || user

if (!host || !user || !pass) {
  console.warn('SMTP not fully configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in env.')
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
})

export async function sendOTPEmail(to: string, otp: string) {
  if (!host || !user || !pass) {
    console.warn('Skipping email send: SMTP credentials missing')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Verification - Hotel Shri Vishwanath</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8f6f0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #92400e, #991b1b, #92400e); padding: 30px 20px; text-align: center;">
          <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(251, 191, 36, 0.3);">
            <div style="font-size: 36px; color: #fbbf24; font-weight: bold;">🏨</div>
          </div>
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 0.5px;">
            Hotel Shri Vishwanath
          </h1>
          <p style="margin: 8px 0 0; color: #fbbf24; font-size: 16px; opacity: 0.9;">
            Luxury • Comfort • Excellence
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px; color: #92400e; font-size: 24px; font-weight: 600;">
              Verify Your Account
            </h2>
            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #fbbf24, #f59e0b); margin: 0 auto;"></div>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 15px; color: #92400e; font-size: 16px; line-height: 1.6;">
              Thank you for choosing Hotel Shri Vishwanath! To complete your account registration, please use the verification code below:
            </p>
          </div>

          <!-- OTP Box -->
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #92400e, #991b1b); padding: 20px 40px; border-radius: 12px; box-shadow: 0 6px 20px rgba(146, 64, 14, 0.3);">
              <p style="margin: 0 0 8px; color: #fbbf24; font-size: 14px; font-weight: 500; letter-spacing: 1px;">
                VERIFICATION CODE
              </p>
              <div style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
          </div>

          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
              ⏰ <strong>This code will expire in 10 minutes</strong><br>
              🔒 For your security, never share this code with anyone
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px;">
            <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you didn't request this verification code, you can safely ignore this email. Someone may have entered your email address by mistake.
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
              Need help? Contact our support team at <a href="mailto:support@hotelshrivishwanath.com" style="color: #92400e; text-decoration: none;">support@hotelshrivishwanath.com</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1f2937; padding: 30px 20px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px; color: #fbbf24; font-size: 18px; font-weight: 600;">
              Hotel Shri Vishwanath
            </h3>
            <p style="margin: 0 0 15px; color: #d1d5db; font-size: 14px; line-height: 1.5;">
              Experience luxury and comfort in the heart of Varanasi<br>
              Near BHU Campus • Sacred Ganges Ghats • World-Class Amenities
            </p>
          </div>
          
          <div style="border-top: 1px solid #374151; padding-top: 20px;">
            <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
              📍 Address: Near BHU Campus, Varanasi, Uttar Pradesh<br>
              📞 Phone: +91 XXXXX XXXXX | 📧 Email: info@hotelshrivishwanath.com
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 11px;">
              © 2026 Hotel Shri Vishwanath. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from,
    to,
    subject: '🔐 Account Verification - Hotel Shri Vishwanath',
    html,
  })
}
