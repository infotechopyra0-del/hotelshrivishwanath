import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, receipt } = await req.json();
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
