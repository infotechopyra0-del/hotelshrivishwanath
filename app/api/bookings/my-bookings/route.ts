import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Booking from '@/models/Booking'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }
    const userId = session.user.id
    const bookings = await Booking.find({ customer: userId })
      .populate({
        path: 'room',
        select: 'roomNumber roomType images amenities pricePerNight'
      })
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
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
