import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Gallery from '@/models/Gallery';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const images = await Gallery.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(images, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { src, alt, category, featured, order, publicId } = body;

    // Validation
    if (!src || !alt || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newImage = await Gallery.create({
      src,
      alt,
      category,
      featured: featured || false,
      order: order || 0,
      publicId: publicId || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Image added successfully',
        image: newImage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create image' },
      { status: 500 }
    );
  }
}