import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Room from '@/models/Room';

export async function GET() {
  try {
    console.log('🏨 API: Starting rooms fetch...')
    
    await dbConnect();
    console.log('✅ API: Database connected')
    
    const rooms = await Room.find({}).lean();
    console.log('📊 API: Found rooms:', rooms.length)
    
    const roomsWithId = rooms.map(room => ({
      ...room,
      _id: room._id?.toString() || '',
    }));
    
    console.log('✅ API: Returning rooms data')
    return NextResponse.json(roomsWithId);
    
  } catch (error) {
    console.error('💥 API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
