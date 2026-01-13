import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Room from '@/models/Room';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET - Fetch single room
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const room = await Room.findById(params.id);
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(room, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update room
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { src, alt, category, order, featured } = body;
    
    // Find existing room
    const existingRoom = await Room.findById(params.id);
    
    if (!existingRoom) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }
    
    // Validation
    if (!alt || !category) {
      return NextResponse.json(
        { success: false, error: 'Alt text and category are required' },
        { status: 400 }
      );
    }
    
    // If new image is uploaded, delete old one from Cloudinary
    if (src && src.public_id && src.public_id !== existingRoom.src.public_id) {
      try {
        await cloudinary.uploader.destroy(existingRoom.src.public_id);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }
    
    // Update room
    const updatedRoom = await Room.findByIdAndUpdate(
      params.id,
      {
        src: src || existingRoom.src,
        alt,
        category,
        order: order !== undefined ? order : existingRoom.order,
        featured: featured !== undefined ? featured : existingRoom.featured
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(
      { success: true, room: updatedRoom, message: 'Room updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update room', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete room
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const room = await Room.findById(params.id);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }
    
    // Delete image from Cloudinary
    if (room.src && room.src.public_id) {
      try {
        await cloudinary.uploader.destroy(room.src.public_id);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }
    
    await Room.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Room deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete room', message: error.message },
      { status: 500 }
    );
  }
}