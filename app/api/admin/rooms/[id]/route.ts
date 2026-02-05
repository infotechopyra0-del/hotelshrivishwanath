import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Room from "@/models/Room";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const room = await Room.findById(id);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(room, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch room", message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update room by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await req.json();
    const {
      image,
      title,
      description,
      category,
      price,
      bedType,
      maxOccupancy,
      amenities,
      status,
      isAvailable,
      featured,
      order,
    } = body;

    // Validation
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Room image is required" },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category is required" },
        { status: 400 }
      );
    }

    if (!price || price < 0) {
      return NextResponse.json(
        { success: false, error: "Valid price is required" },
        { status: 400 }
      );
    }

    // Find and update room
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        image,
        title: title.trim(),
        description: description.trim(),
        category,
        price,
        bedType: bedType || "Double",
        maxOccupancy: maxOccupancy || 2,
        amenities: amenities || [],
        status: status || "ACTIVE",
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        featured: featured || false,
        order: order || 0,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Room updated successfully", 
        room: updatedRoom 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update room", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE room by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }
     if (typeof deletedRoom.image === 'object' && deletedRoom.image.public_id) {
       await cloudinary.uploader.destroy(deletedRoom.image.public_id);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Room deleted successfully", 
        deletedId: id 
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to delete room", message: error.message },
      { status: 500 }
    );
  }
}