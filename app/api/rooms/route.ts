import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Room from '@/models/Room';

export async function GET() {
  try {    
    await dbConnect();
    const rooms = await Room.find({}).lean();    
    const roomsWithId = rooms.map(room => ({
      ...room,
      _id: room._id?.toString() || '',
    }));
    return NextResponse.json(roomsWithId);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
