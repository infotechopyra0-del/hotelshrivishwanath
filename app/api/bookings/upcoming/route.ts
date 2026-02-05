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
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const bookings = await Booking.find({
      customer: session.user.id,
      checkIn: { $gte: today },
      bookingStatus: { $in: ['Confirmed', 'Checked-In'] }
    })
      .populate({
        path: 'room',
        select: 'roomNumber roomType images pricePerNight'
      })
      .sort({ checkIn: 1 })
      .lean()

    return NextResponse.json(
      {
        success: true,
        bookings,
        count: bookings.length
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch upcoming bookings',
        error: error.message
      },
      { status: 500 }
    )
  }
}