import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, inquiry_type, message } = await req.json();
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    await dbConnect();
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      inquiry_type: inquiry_type || 'general',
      message: message.trim(),
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Contact message sent successfully!',
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        inquiry_type: newContact.inquiry_type,
        status: newContact.status,
      },
    });
  } catch (error: any) {
    console.error('Error creating contact:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get all contacts ordered by creation date (newest first)
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}