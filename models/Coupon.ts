import mongoose, { Schema, Document } from 'mongoose'

// Interface for Coupon document
export interface ICoupon extends Document {
  code: string
  name: string
  description: string
  type: 'Fixed' | 'Percentage'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  usageLimit: number
  usageCount: number
  userUsageLimit: number
  validFrom: Date
  validUntil: Date
  applicableCategories: string[]
  applicableRooms: mongoose.Types.ObjectId[]
  excludedDates: Date[]
  isActive: boolean
  isPublic: boolean
  createdBy: mongoose.Types.ObjectId
  usedBy: {
    customer: mongoose.Types.ObjectId
    booking: mongoose.Types.ObjectId
    usedAt: Date
    discountAmount: number
  }[]
  createdAt: Date
  updatedAt: Date
}

// Coupon Schema
const CouponSchema: Schema = new Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    match: [/^[A-Z0-9]+$/, 'Coupon code can only contain letters and numbers']
  },
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    trim: true,
    maxlength: [100, 'Coupon name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Coupon type is required'],
    enum: {
      values: ['Fixed', 'Percentage'],
      message: 'Type must be either Fixed or Percentage'
    }
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Value cannot be negative'],
    validate: {
      validator: function(this: ICoupon, value: number) {
        if (this.type === 'Percentage') {
          return value <= 100
        }
        return true
      },
      message: 'Percentage value cannot exceed 100'
    }
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative'],
    validate: {
      validator: function(this: ICoupon, value?: number) {
        // Max discount only applies to percentage coupons
        if (this.type === 'Fixed' && value) {
          return false
        }
        return true
      },
      message: 'Maximum discount only applies to percentage coupons'
    }
  },
  usageLimit: {
    type: Number,
    required: [true, 'Usage limit is required'],
    min: [1, 'Usage limit must be at least 1']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  userUsageLimit: {
    type: Number,
    default: 1,
    min: [1, 'User usage limit must be at least 1']
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
    validate: {
      validator: function(this: ICoupon, value: Date) {
        return value > this.validFrom
      },
      message: 'Valid until date must be after valid from date'
    }
  },
  applicableCategories: [{
    type: String,
    enum: ['Standard', 'Deluxe', 'Premium Suite']
  }],
  applicableRooms: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }],
  excludedDates: [{
    type: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Created by is required']
  },
  usedBy: [{
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for remaining usage
CouponSchema.virtual('remainingUsage').get(function(this: ICoupon) {
  return Math.max(0, this.usageLimit - this.usageCount)
})

// Virtual for usage percentage
CouponSchema.virtual('usagePercentage').get(function(this: ICoupon) {
  return (this.usageCount / this.usageLimit) * 100
})

// Virtual for is expired
CouponSchema.virtual('isExpired').get(function(this: ICoupon) {
  return new Date() > this.validUntil
})

// Virtual for is valid
CouponSchema.virtual('isValid').get(function(this: ICoupon) {
  const now = new Date()
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil && 
         this.usageCount < this.usageLimit
})

// Virtual for total discount given
CouponSchema.virtual('totalDiscountGiven').get(function(this: ICoupon) {
  return this.usedBy.reduce((total: number, usage: any) => total + usage.discountAmount, 0)
})

// Index for efficient queries
CouponSchema.index({ code: 1 }, { unique: true })
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 })
CouponSchema.index({ validUntil: 1 })
CouponSchema.index({ createdBy: 1 })
CouponSchema.index({ isPublic: 1, isActive: 1 })

// Static methods
CouponSchema.statics.findValidCoupons = function() {
  const now = new Date()
  return this.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $expr: { $lt: ['$usageCount', '$usageLimit'] }
  })
}

CouponSchema.statics.findPublicCoupons = function() {
  const now = new Date()
  return this.find({
    isActive: true,
    isPublic: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $expr: { $lt: ['$usageCount', '$usageLimit'] }
  }).sort({ createdAt: -1 })
}

CouponSchema.statics.findByCode = function(code: string) {
  return this.findOne({ code: code.toUpperCase() })
}

CouponSchema.statics.getUsageStats = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $unwind: '$usedBy'
    },
    {
      $match: {
        'usedBy.usedAt': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: 1 },
        totalDiscountGiven: { $sum: '$usedBy.discountAmount' },
        averageDiscount: { $avg: '$usedBy.discountAmount' },
        uniqueCoupons: { $addToSet: '$_id' }
      }
    },
    {
      $project: {
        totalUsage: 1,
        totalDiscountGiven: 1,
        averageDiscount: 1,
        uniqueCouponsCount: { $size: '$uniqueCoupons' }
      }
    }
  ])
}

// Instance methods
CouponSchema.methods.validateForBooking = function(
  bookingAmount: number,
  customerId: mongoose.Types.ObjectId,
  roomCategory?: string,
  roomId?: mongoose.Types.ObjectId,
  bookingDate?: Date
) {
  // Check if coupon is active and not expired
  if (!this.isValid) {
    return { isValid: false, error: 'Coupon is not valid or has expired' }
  }

  // Check minimum order amount
  if (bookingAmount < this.minOrderAmount) {
    return { 
      isValid: false, 
      error: `Minimum order amount of ₹${this.minOrderAmount} required` 
    }
  }

  // Check user usage limit
  const userUsageCount = this.usedBy.filter(
    (usage: any) => usage.customer.toString() === customerId.toString()
  ).length

  if (userUsageCount >= this.userUsageLimit) {
    return { 
      isValid: false, 
      error: 'You have already used this coupon the maximum number of times' 
    }
  }

  // Check category restrictions
  if (this.applicableCategories.length > 0 && roomCategory) {
    if (!this.applicableCategories.includes(roomCategory)) {
      return { 
        isValid: false, 
        error: 'This coupon is not applicable for this room category' 
      }
    }
  }

  // Check room restrictions
  if (this.applicableRooms.length > 0 && roomId) {
    const roomIdString = roomId.toString()
    const isApplicable = this.applicableRooms.some(
      (id: any) => id.toString() === roomIdString
    )
    
    if (!isApplicable) {
      return { 
        isValid: false, 
        error: 'This coupon is not applicable for this room' 
      }
    }
  }

  // Check excluded dates
  if (bookingDate && this.excludedDates.length > 0) {
    const isExcluded = this.excludedDates.some(
      (excludedDate: any) => excludedDate.toDateString() === bookingDate.toDateString()
    )
    
    if (isExcluded) {
      return { 
        isValid: false, 
        error: 'This coupon is not valid for the selected date' 
      }
    }
  }

  return { isValid: true }
}

CouponSchema.methods.calculateDiscount = function(orderAmount: number) {
  if (this.type === 'Fixed') {
    return Math.min(this.value, orderAmount)
  } else {
    const discount = (orderAmount * this.value) / 100
    return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount
  }
}

CouponSchema.methods.useCoupon = function(
  customerId: mongoose.Types.ObjectId,
  bookingId: mongoose.Types.ObjectId,
  discountAmount: number
) {
  this.usageCount += 1
  this.usedBy.push({
    customer: customerId,
    booking: bookingId,
    usedAt: new Date(),
    discountAmount
  })
  
  return this.save()
}

CouponSchema.methods.deactivate = function() {
  this.isActive = false
  return this.save()
}

CouponSchema.methods.extendValidity = function(newValidUntil: Date) {
  if (newValidUntil <= this.validUntil) {
    throw new Error('New valid until date must be after current valid until date')
  }
  
  this.validUntil = newValidUntil
  return this.save()
}

// Export model
const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema)

export default Coupon