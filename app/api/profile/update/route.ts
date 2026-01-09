import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const data = await request.json()

    // Update user data in database
    const updatedUser = await Customer.findOneAndUpdate(
      { email: session.user.email },
      {
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        idType: data.idType,
        idNumber: data.idNumber,
        address: {
          street: data.address?.street,
          city: data.address?.city,
          state: data.address?.state,
          country: data.address?.country,
          zipCode: data.address?.zipCode
        },
        emergencyContact: {
          name: data.emergencyContact?.name,
          phone: data.emergencyContact?.phone,
          relation: data.emergencyContact?.relation
        },
        preferences: {
          roomType: data.preferences?.roomType,
          bedType: data.preferences?.bedType,
          floorPreference: data.preferences?.floorPreference,
          dietaryRequirements: data.preferences?.dietaryRequirements,
          specialRequests: data.preferences?.specialRequests
        }
      },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}