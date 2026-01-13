import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Room from '@/models/Room';

// GET - Fetch all rooms
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const rooms = await Room.find(filter).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(rooms, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new room
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { src, alt, category, order, featured } = body;
    if (!src || !src.url || !src.public_id) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }
    
    if (!alt || !category) {
      return NextResponse.json(
        { success: false, error: 'Alt text and category are required' },
        { status: 400 }
      );
    }
    
    // Create room
    const room = await Room.create({
      src,
      alt,
      category,
      order: order || 0,
      featured: featured || false
    });
    
    return NextResponse.json(
      { success: true, room, message: 'Room created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room', message: error.message },
      { status: 500 }
    );
  }
}
