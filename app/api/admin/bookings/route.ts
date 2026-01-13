import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch all bookings
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    await dbConnect();
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('room', 'roomNumber roomType')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    
    // Validate required fields
    const {
      customer,
      room,
      checkIn,
      checkOut,
      guests,
      roomRate,
      totalAmount,
    } = body;

    if (!customer || !room || !checkIn || !checkOut || !guests || !roomRate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new booking
    const newBooking = await Booking.create({
      ...body,
      createdBy: session.user.id,
    });

    // Populate references before returning
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('customer', 'name email phone')
      .populate('room', 'roomNumber roomType');

    return NextResponse.json(populatedBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}