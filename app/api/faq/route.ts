import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FAQ from '@/models/FAQ';

export async function GET() {
  await dbConnect();
  try {
    const faqs = await FAQ.find({}, { question: 1, answer: 1, _id: 0 })
      .sort({ order: 1, createdAt: 1 }) // Sort by order first, then creation date
      .lean(); // Use lean for faster queries
    
    return NextResponse.json(faqs, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // Cache for 5 minutes
        'ETag': `"faqs-${Date.now()}"`
      }
    });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return NextResponse.json([], { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }
}
