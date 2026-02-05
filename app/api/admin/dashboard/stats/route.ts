import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/Customer";
import Booking from "@/models/Booking";
import GalleryImage from "@/models/Gallery";
import Room from "@/models/Room";
import FAQ from "@/models/FAQ";
import Contact from "@/models/Contact";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Fetch all counts in parallel for better performance
    const [
      totalUsers,
      totalBookings,
      totalGalleryImages,
      totalRooms,
      totalFAQs,
      totalContacts,
      pendingBookings,
      activeRooms,
    ] = await Promise.all([
      User?.countDocuments() || Promise.resolve(0),
      Booking?.countDocuments() || Promise.resolve(0),
      GalleryImage?.countDocuments() || Promise.resolve(0),
      Room?.countDocuments() || Promise.resolve(0),
      FAQ?.countDocuments() || Promise.resolve(0),
      Contact?.countDocuments() || Promise.resolve(0),
      Booking?.countDocuments({ status: "pending" }) || Promise.resolve(0),
      Room?.countDocuments({ status: "ACTIVE", isAvailable: true }) || Promise.resolve(0),
    ]);

    const stats = {
      totalUsers,
      totalBookings,
      totalGalleryImages,
      totalRooms,
      totalFAQs,
      totalContacts,
      pendingBookings,
      activeRooms,
    };

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
        message: error.message,
      },
      { status: 500 }
    );
  }
}