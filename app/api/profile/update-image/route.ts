import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/dbConnect'
import Customer from '@/models/Customer'
import { authOptions } from '@/lib/auth'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    const result = await db.collection('customers').updateOne(
      { email: session.user.email },
      { $set: { profileImage: imageUrl } }
    )
    
    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Profile image updated successfully'
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

  } catch (error) {
    console.error('Profile image update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile image' },
      { status: 500 }
    )
  }
}