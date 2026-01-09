import mongoose, { Schema, Document } from 'mongoose'

// Interface for Review document
export interface IReview extends Document {
  customer: mongoose.Types.ObjectId
  booking: mongoose.Types.ObjectId
  room: mongoose.Types.ObjectId
  rating: {
    overall: number
    cleanliness: number
    service: number
    amenities: number
    valueForMoney: number
    location: number
  }
  title: string
  comment: string
  pros: string[]
  cons: string[]
  images?: {
    url: string
    publicId: string
    caption?: string
  }[]
  status: 'Pending' | 'Approved' | 'Rejected'
  isPublic: boolean
  isVerified: boolean
  helpfulVotes: number
  reportCount: number
  adminResponse?: {
    message: string
    respondedBy: mongoose.Types.ObjectId
    respondedAt: Date
  }
  moderationNotes?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

// Review Schema
const ReviewSchema: Schema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room reference is required']
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    cleanliness: {
      type: Number,
      required: [true, 'Cleanliness rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    service: {
      type: Number,
      required: [true, 'Service rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    amenities: {
      type: Number,
      required: [true, 'Amenities rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    valueForMoney: {
      type: Number,
      required: [true, 'Value for money rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    location: {
      type: Number,
      required: [true, 'Location rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each pro cannot exceed 200 characters']
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each con cannot exceed 200 characters']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: [0, 'Helpful votes cannot be negative']
  },
  reportCount: {
    type: Number,
    default: 0,
    min: [0, 'Report count cannot be negative']
  },
  adminResponse: {
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Admin response cannot exceed 500 characters']
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  },
  moderationNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Moderation notes cannot exceed 500 characters']
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Rejection reason cannot exceed 200 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for average rating
ReviewSchema.virtual('averageRating').get(function(this: IReview) {
  const ratings = this.rating
  return (
    ratings.overall + 
    ratings.cleanliness + 
    ratings.service + 
    ratings.amenities + 
    ratings.valueForMoney + 
    ratings.location
  ) / 6
})

// Virtual for rating summary
ReviewSchema.virtual('ratingSummary').get(function(this: IReview) {
  const ratings = this.rating
  const average = (
    ratings.overall + 
    ratings.cleanliness + 
    ratings.service + 
    ratings.amenities + 
    ratings.valueForMoney + 
    ratings.location
  ) / 6
  
  return {
    average: average,
    breakdown: this.rating,
    total: 6 // Total rating categories
  }
})

// Index for efficient queries
ReviewSchema.index({ customer: 1, booking: 1 }, { unique: true })
ReviewSchema.index({ room: 1 })
ReviewSchema.index({ status: 1 })
ReviewSchema.index({ isPublic: 1, status: 1 })
ReviewSchema.index({ 'rating.overall': -1 })
ReviewSchema.index({ createdAt: -1 })
ReviewSchema.index({ helpfulVotes: -1 })

// Compound index for public approved reviews
ReviewSchema.index({ isPublic: 1, status: 1, createdAt: -1 })

// Pre-save middleware
ReviewSchema.pre('save', function() {
  // Auto-verify reviews from verified bookings
  if (this.isNew && this.booking) {
    // You would check if the booking is verified/completed here
    // this.isVerified = true
  }
})

// Static methods
ReviewSchema.statics.getPublicReviews = function(limit: number = 10) {
  return this.find({ 
    status: 'Approved', 
    isPublic: true 
  })
  .populate('customer', 'name')
  .populate('room', 'name category')
  .sort({ createdAt: -1 })
  .limit(limit)
}

ReviewSchema.statics.getPendingReviews = function() {
  return this.find({ status: 'Pending' })
    .populate('customer', 'name email')
    .populate('booking', 'bookingId checkIn checkOut')
    .populate('room', 'name roomNumber')
    .sort({ createdAt: 1 })
}

ReviewSchema.statics.getRoomRatings = function(roomId: string) {
  return this.aggregate([
    {
      $match: {
        room: new mongoose.Types.ObjectId(roomId),
        status: 'Approved',
        isPublic: true
      }
    },
    {
      $group: {
        _id: null,
        averageOverall: { $avg: '$rating.overall' },
        averageCleanliness: { $avg: '$rating.cleanliness' },
        averageService: { $avg: '$rating.service' },
        averageAmenities: { $avg: '$rating.amenities' },
        averageValue: { $avg: '$rating.valueForMoney' },
        averageLocation: { $avg: '$rating.location' },
        totalReviews: { $sum: 1 },
        fiveStars: {
          $sum: { $cond: [{ $gte: ['$rating.overall', 5] }, 1, 0] }
        },
        fourStars: {
          $sum: { $cond: [{ $and: [{ $gte: ['$rating.overall', 4] }, { $lt: ['$rating.overall', 5] }] }, 1, 0] }
        },
        threeStars: {
          $sum: { $cond: [{ $and: [{ $gte: ['$rating.overall', 3] }, { $lt: ['$rating.overall', 4] }] }, 1, 0] }
        },
        twoStars: {
          $sum: { $cond: [{ $and: [{ $gte: ['$rating.overall', 2] }, { $lt: ['$rating.overall', 3] }] }, 1, 0] }
        },
        oneStar: {
          $sum: { $cond: [{ $lt: ['$rating.overall', 2] }, 1, 0] }
        }
      }
    }
  ])
}

ReviewSchema.statics.getTopReviews = function(limit: number = 5) {
  return this.find({
    status: 'Approved',
    isPublic: true
  })
  .populate('customer', 'name')
  .populate('room', 'name category')
  .sort({ 'rating.overall': -1, helpfulVotes: -1 })
  .limit(limit)
}

// Instance methods
ReviewSchema.methods.approve = function(moderatorId?: mongoose.Types.ObjectId, notes?: string) {
  this.status = 'Approved'
  if (notes) this.moderationNotes = notes
  return this.save()
}

ReviewSchema.methods.reject = function(reason: string, moderatorId?: mongoose.Types.ObjectId) {
  this.status = 'Rejected'
  this.rejectionReason = reason
  return this.save()
}

ReviewSchema.methods.addHelpfulVote = function() {
  this.helpfulVotes += 1
  return this.save()
}

ReviewSchema.methods.reportReview = function() {
  this.reportCount += 1
  
  // Auto-hide if too many reports
  if (this.reportCount >= 5) {
    this.isPublic = false
  }
  
  return this.save()
}

ReviewSchema.methods.addAdminResponse = function(message: string, adminId: mongoose.Types.ObjectId) {
  this.adminResponse = {
    message,
    respondedBy: adminId,
    respondedAt: new Date()
  }
  return this.save()
}

// Export model
const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

export default Review