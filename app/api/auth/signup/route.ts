import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'
import { sendOTPEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { fullName, email, password } = await request.json()
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (fullName.length < 3) {
      return NextResponse.json(
        { message: 'Name must be at least 3 characters' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid Email Id' },
        { status: 400 }
      )
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return NextResponse.json(
        { message: 'Invalid Email Id' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUser = await Customer.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email Already Exist' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcryptjs.hash(password, 12)
    const newUser = new Customer({
      name: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      isVerified: false,
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    newUser.otpCode = otp
    newUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await newUser.save()

    try {
      await sendOTPEmail(newUser.email, otp)
    } catch (err) {
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully. OTP sent to email.',
        requiresVerification: true,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}