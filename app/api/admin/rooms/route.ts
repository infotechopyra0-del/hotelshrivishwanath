import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Room from "@/models/Room";

// GET all rooms (Admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const rooms = await Room.find({})
      .sort({ featured: -1, order: 1, createdAt: -1 });
    
    return NextResponse.json(rooms, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms", message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new room
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
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

    // Create new room
    const newRoom = await Room.create({
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
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Room created successfully", 
        room: newRoom 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to create room", message: error.message },
      { status: 500 }
    );
  }
}