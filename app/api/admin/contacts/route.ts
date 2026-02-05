import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(contacts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}