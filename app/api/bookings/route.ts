import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Room from '@/models/Room';
import Customer from '@/models/Customer';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // Find or create customer (by email)
    let customer = await Customer.findOne({ email: data.email });
    if (!customer) {
      customer = await Customer.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      });
    }

    // Validate room
    const room = await Room.findById(data.roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Prepare booking
    const booking = await Booking.create({
      customer: customer._id,
      room: room._id,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guests: { adults: data.guests, children: 0, infants: 0 },
      guestDetails: [{ name: data.firstName + ' ' + data.lastName }],
      roomRate: room.price,
      totalAmount: data.totalAmount,
      taxes: Math.round(room.price * data.nights * 0.12),
      discount: 0,
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      paymentId: data.paymentId,
      bookingStatus: 'Confirmed',
      specialRequests: data.specialRequests,
      source: 'Website',
    });

    return NextResponse.json({ success: true, bookingId: booking.bookingId });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}
