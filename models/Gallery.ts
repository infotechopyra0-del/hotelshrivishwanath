import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  src: string;
  alt: string;
  category: string;
  featured: boolean;
  order: number;
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    src: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    alt: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Heritage',
        'Spiritual',
        'Architecture',
        'Culture',
        'Streets',
        'Markets',
        'Scenic',
        'Educational',
        'Historical',
        'Other',
      ],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
GallerySchema.index({ category: 1, order: 1 });
GallerySchema.index({ featured: 1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);