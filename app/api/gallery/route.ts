import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Gallery from '@/models/Gallery';

export async function GET() {
  await dbConnect();
  try {
    const images = await Gallery.find({}).lean();
    // Transform the data to include id field
    const transformedImages = images.map((image) => ({
      id: image._id.toString(),
      src: image.src,
      alt: image.alt,
      category: image.category
    }));
    return NextResponse.json(transformedImages);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
