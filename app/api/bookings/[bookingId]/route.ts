import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Booking from '@/models/Booking'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Fetch specific booking details
export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booking = await Booking.findOne({
      bookingId: params.bookingId,
      customer: session.user.id
    })
      .populate({
        path: 'room',
        select: 'roomNumber roomType images amenities pricePerNight description'
      })
      .populate({
        path: 'customer',
        select: 'name email phone'
      })
      .lean()

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        booking
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch booking',
        error: error.message
      },
      { status: 500 }
    )
  }
}

// PATCH - Cancel a booking
export async function PATCH(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { reason } = await req.json()

    const booking = await Booking.findOne({
      bookingId: params.bookingId,
      customer: session.user.id
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return NextResponse.json(
        { success: false, message: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (booking.bookingStatus === 'Checked-Out') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel a completed booking' },
        { status: 400 }
      )
    }

    // Cancel the booking
    await booking.cancel(reason || 'Cancelled by user')

    return NextResponse.json(
      {
        success: true,
        message: 'Booking cancelled successfully',
        booking
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to cancel booking',
        error: error.message
      },
      { status: 500 }
    )
  }
}

