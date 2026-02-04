import mongoose, { Document, Model, Schema } from 'mongoose';

interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  inquiry_type: 'general' | 'booking' | 'event' | 'complaint' | 'feedback';
  message: string;
  status: 'pending' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        'Please provide a valid phone number',
      ],
    },
    inquiry_type: {
      type: String,
      required: true,
      enum: {
        values: ['general', 'booking', 'event', 'complaint', 'feedback'],
        message: 'Inquiry type must be one of: general, booking, event, complaint, feedback',
      },
      default: 'general',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'replied'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ inquiry_type: 1 });
ContactSchema.index({ email: 1 });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
export type { IContact };