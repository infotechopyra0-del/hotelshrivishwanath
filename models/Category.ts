import mongoose, { Schema, Document } from 'mongoose'

// Interface for Category document
export interface ICategory extends Document {
  name: string
  description: string
  basePrice: number
  features: string[]
  maxOccupancy: number
  roomCount: number
  isActive: boolean
  image: {
    url: string
    publicId: string
  }
  createdAt: Date
  updatedAt: Date
}

// Category Schema
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    trim: true
  }],
  maxOccupancy: {
    type: Number,
    required: [true, 'Maximum occupancy is required'],
    min: [1, 'Maximum occupancy must be at least 1'],
    max: [10, 'Maximum occupancy cannot exceed 10']
  },
  roomCount: {
    type: Number,
    default: 0,
    min: [0, 'Room count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Category image is required']
    },
    publicId: {
      type: String,
      required: [true, 'Image public ID is required']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for rooms in this category
CategorySchema.virtual('rooms', {
  ref: 'Room',
  localField: 'name',
  foreignField: 'category'
})

// Index for efficient queries
CategorySchema.index({ name: 1 }, { unique: true })
CategorySchema.index({ isActive: 1 })

// Static methods
CategorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true }).sort({ basePrice: 1 })
}

// Export model
const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)

export default Category