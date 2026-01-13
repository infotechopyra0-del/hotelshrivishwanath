import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  src: {
    url: string;
    public_id: string;
  };
  alt: string;
  category: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    src: {
      type: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      },
      required: true
    },
    alt: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true,
      maxlength: [200, 'Alt text cannot exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Hotel Rooms', 'Suites', 'Deluxe Rooms', 'Premium Rooms', 'Standard Rooms', 'Other'],
      default: 'Hotel Rooms'
    },
    order: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
RoomSchema.index({ category: 1, order: 1 });
RoomSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);