import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 })
    }

    const user = await Customer.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!user.otpCode || !user.otpExpires) {
      return NextResponse.json({ message: 'No OTP found for this user' }, { status: 400 })
    }

    if (user.otpExpires < new Date()) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 })
    }

    if (user.otpCode !== otp.toString()) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    user.isVerified = true
    user.otpCode = undefined
    user.otpExpires = undefined

    await user.save()

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
