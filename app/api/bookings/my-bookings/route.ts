import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Booking from '@/models/Booking'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Fetch all bookings for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get user session
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Fetch all bookings for this user with room and customer details populated
    const bookings = await Booking.find({ customer: userId })
      .populate({
        path: 'room',
        select: 'roomNumber roomType images amenities pricePerNight'
      })
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 }) // Most recent first
      .lean()

    return NextResponse.json(
      {
        success: true,
        message: 'Bookings retrieved successfully',
        bookings,
        count: bookings.length
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      },
      { status: 500 }
    )
  }
}
