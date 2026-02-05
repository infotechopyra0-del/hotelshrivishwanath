import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'
import { authOptions } from '@/lib/auth'
import mongoose from 'mongoose'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Use direct Customer model for better performance
    const user = await Customer.findOne(
      { email: session.user.email },
      { 
        password: 0, 
        emailVerificationToken: 0, 
        passwordResetToken: 0,
        __v: 0
      }
    ).lean() // Use lean() for faster queries

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform user data to match profile page format
    const profileData = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
      gender: user.gender || 'Male',
      idType: user.idType || 'Aadhar',
      idNumber: user.idNumber || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || '',
        zipCode: user.address?.zipCode || ''
      },
      emergencyContact: {
        name: user.emergencyContact?.name || '',
        phone: user.emergencyContact?.phone || '',
        relation: user.emergencyContact?.relation || ''
      },
      preferences: {
        roomType: user.preferences?.roomType || '',
        bedType: user.preferences?.bedType || '',
        floorPreference: user.preferences?.floorPreference || '',
        dietaryRequirements: user.preferences?.dietaryRequirements || [],
        specialRequests: user.preferences?.specialRequests || ''
      },
      profileImage: user.profileImage || '/images/userdefault.jpeg'
    }

    return NextResponse.json({ success: true, data: profileData }, { 
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute
        'ETag': `"${user._id.toString()}-${user.updatedAt?.getTime() || Date.now()}"`
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
}