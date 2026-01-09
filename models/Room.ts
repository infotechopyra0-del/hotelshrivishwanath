import mongoose, { Schema, Document } from 'mongoose'

// Interface for Room document
export interface IRoom extends Document {
  name: string
  description: string
  category: 'Standard' | 'Deluxe' | 'Premium Suite'
  price: number
  maxOccupancy: number
  size: number // in sq ft
  images: {
    url: string
    publicId: string
    caption?: string
  }[]
  amenities: string[]
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Out of Service'
  roomNumber: string
  floor: number
  bedType: 'Single' | 'Double' | 'Queen' | 'King' | 'Twin'
  hasBalcony: boolean
  hasKitchen: boolean
  hasAC: boolean
  hasWiFi: boolean
  rating: number
  totalRatings: number
  bookings: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// Room Schema
const RoomSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Room category is required'],
    enum: {
      values: ['Standard', 'Deluxe', 'Premium Suite'],
      message: 'Category must be Standard, Deluxe, or Premium Suite'
    }
  },
  price: {
    type: Number,
    required: [true, 'Room price is required'],
    min: [0, 'Price cannot be negative']
  },
  maxOccupancy: {
    type: Number,
    required: [true, 'Maximum occupancy is required'],
    min: [1, 'Maximum occupancy must be at least 1'],
    max: [10, 'Maximum occupancy cannot exceed 10']
  },
  size: {
    type: Number,
    required: [true, 'Room size is required'],
    min: [50, 'Room size must be at least 50 sq ft']
  },
  images: [{
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    }
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: [true, 'Room status is required'],
    enum: {
      values: ['Available', 'Occupied', 'Maintenance', 'Out of Service'],
      message: 'Status must be Available, Occupied, Maintenance, or Out of Service'
    },
    default: 'Available'
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  floor: {
    type: Number,
    required: [true, 'Floor number is required'],
    min: [1, 'Floor must be at least 1']
  },
  bedType: {
    type: String,
    required: [true, 'Bed type is required'],
    enum: {
      values: ['Single', 'Double', 'Queen', 'King', 'Twin'],
      message: 'Bed type must be Single, Double, Queen, King, or Twin'
    }
  },
  hasBalcony: {
    type: Boolean,
    default: false
  },
  hasKitchen: {
    type: Boolean,
    default: false
  },
  hasAC: {
    type: Boolean,
    default: true
  },
  hasWiFi: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: [0, 'Total ratings cannot be negative']
  },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for average rating
RoomSchema.virtual('averageRating').get(function(this: IRoom) {
  if (this.totalRatings === 0) return 0
  return Number((this.rating / this.totalRatings).toFixed(1))
})

// Virtual for main image
RoomSchema.virtual('mainImage').get(function(this: IRoom) {
  return this.images && this.images.length > 0 ? this.images[0].url : null
})

// Index for efficient queries
RoomSchema.index({ category: 1, status: 1 })
RoomSchema.index({ roomNumber: 1 }, { unique: true })
RoomSchema.index({ price: 1 })
RoomSchema.index({ floor: 1 })

// Pre-save middleware
RoomSchema.pre('save', function(this: IRoom) {
  // Ensure at least one image
  if (!this.images || this.images.length === 0) {
    throw new Error('At least one image is required')
  }

  // Auto-generate amenities based on room features
  const autoAmenities: string[] = []
  if (this.hasAC) autoAmenities.push('Air Conditioning')
  if (this.hasWiFi) autoAmenities.push('Free WiFi')
  if (this.hasBalcony) autoAmenities.push('Balcony')
  if (this.hasKitchen) autoAmenities.push('Kitchenette')

  // Merge with existing amenities (remove duplicates)
  this.amenities = [...new Set([...this.amenities, ...autoAmenities])]
})

// Static methods
RoomSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, status: { $ne: 'Out of Service' } })
}

RoomSchema.statics.findAvailable = function(checkIn?: Date, checkOut?: Date) {
  const query: any = { status: 'Available' }
  
  // Add date availability check if dates provided
  if (checkIn && checkOut) {
    // This is a simplified check - you'd need to implement proper booking conflict checking
    query.status = 'Available'
  }
  
  return this.find(query)
}

RoomSchema.statics.updateRating = async function(roomId: string, newRating: number) {
  const room = await this.findById(roomId)
  if (!room) throw new Error('Room not found')

  const totalRating = (room.rating || 0) + newRating
  const totalCount = (room.totalRatings || 0) + 1

  return this.findByIdAndUpdate(
    roomId,
    {
      rating: totalRating,
      totalRatings: totalCount
    },
    { new: true }
  )
}

// Instance methods
RoomSchema.methods.addImage = function(imageData: { url: string; publicId: string; caption?: string }) {
  this.images.push(imageData)
  return this.save()
}

RoomSchema.methods.removeImage = function(publicId: string) {
  this.images = this.images.filter((img: any) => img.publicId !== publicId)
  return this.save()
}

RoomSchema.methods.updateStatus = function(newStatus: string) {
  this.status = newStatus
  return this.save()
}

// Export model
const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema)

export default Room