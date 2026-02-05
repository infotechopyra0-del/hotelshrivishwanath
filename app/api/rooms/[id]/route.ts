import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Room from "@/models/Room";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log('/api/rooms/[id] called with id:', id);
  try {
    await connectDB();
    const room = await Room.findById(id)
      .select("-__v")
      .lean();
    if (!room) {
      console.warn('Room not found for id:', id);
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }
    console.log('Room found:', room);
    return NextResponse.json(room, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    console.error("Error fetching room for id:", id, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch room", message: error.message },
      { status: 500 }
    );
  }
}