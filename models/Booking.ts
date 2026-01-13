import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  bookingId: string
  customer: mongoose.Types.ObjectId
  room: mongoose.Types.ObjectId
  checkIn: Date
  checkOut: Date
  guests: {
    adults: number
    children: number
    infants: number
  }
  guestDetails: {
    name: string
    age?: number
    idType?: string
    idNumber?: string
  }[]
  roomRate: number
  totalAmount: number
  taxes: number
  discount: number
  couponUsed?: mongoose.Types.ObjectId
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Refunded' | 'Failed'
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Net Banking' | 'Wallet'
  paymentId?: string
  bookingStatus: 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled' | 'No-Show'
  specialRequests?: string
  source: 'Website' | 'Phone' | 'Walk-in' | 'OTA' | 'Agent'
  notes?: string
  cancellationReason?: string
  cancellationDate?: Date
  createdBy?: mongoose.Types.ObjectId // Admin who created booking
  createdAt: Date
  updatedAt: Date
}

// Booking Schema
const BookingSchema: Schema = new Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(value: Date) {
        return value >= new Date(Date.now() - 24 * 60 * 60 * 1000) // Allow today or future
      },
      message: 'Check-in date cannot be in the past'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(this: IBooking, value: Date) {
        return value > this.checkIn
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least 1 adult required'],
      max: [10, 'Maximum 10 adults allowed']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative'],
      max: [10, 'Maximum 10 children allowed']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants count cannot be negative'],
      max: [5, 'Maximum 5 infants allowed']
    }
  },
  guestDetails: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      min: 0,
      max: 120
    },
    idType: String,
    idNumber: String
  }],
  roomRate: {
    type: Number,
    required: [true, 'Room rate is required'],
    min: [0, 'Room rate cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  taxes: {
    type: Number,
    default: 0,
    min: [0, 'Taxes cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  couponUsed: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet']
  },
  paymentId: String,
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled', 'No-Show'],
    default: 'Confirmed'
  },
  specialRequests: String,
  source: {
    type: String,
    enum: ['Website', 'Phone', 'Walk-in', 'OTA', 'Agent'],
    default: 'Website'
  },
  notes: String,
  cancellationReason: String,
  cancellationDate: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for number of nights
BookingSchema.virtual('nights').get(function(this: IBooking) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((this.checkOut.getTime() - this.checkIn.getTime()) / oneDay)
})

// Virtual for total guests
BookingSchema.virtual('totalGuests').get(function(this: IBooking) {
  return this.guests.adults + this.guests.children + this.guests.infants
})

// Virtual for booking duration in days
BookingSchema.virtual('duration').get(function(this: IBooking) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.ceil((this.checkOut.getTime() - this.checkIn.getTime()) / oneDay)
})

// Virtual for remaining amount
BookingSchema.virtual('remainingAmount').get(function(this: IBooking) {
  if (this.paymentStatus === 'Paid') return 0
  // This would need to calculate based on actual payments made
  return this.totalAmount
})

// Index for efficient queries
BookingSchema.index({ customer: 1 })
BookingSchema.index({ room: 1 })
BookingSchema.index({ checkIn: 1, checkOut: 1 })
BookingSchema.index({ bookingStatus: 1 })
BookingSchema.index({ paymentStatus: 1 })
BookingSchema.index({ createdAt: -1 })

// Pre-save middleware to generate booking ID
BookingSchema.pre('save', function() {
  if (!this.bookingId) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    
    this.bookingId = `HSV${year}${month}${day}${random}`
  }
})

// Static methods
BookingSchema.statics.findUpcoming = function() {
  const today = new Date()
  return this.find({
    checkIn: { $gte: today },
    bookingStatus: { $in: ['Confirmed', 'Checked-In'] }
  }).sort({ checkIn: 1 })
}

BookingSchema.statics.findCurrent = function() {
  const today = new Date()
  return this.find({
    checkIn: { $lte: today },
    checkOut: { $gt: today },
    bookingStatus: 'Checked-In'
  })
}

BookingSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    $or: [
      {
        checkIn: { $gte: startDate, $lte: endDate }
      },
      {
        checkOut: { $gte: startDate, $lte: endDate }
      },
      {
        checkIn: { $lte: startDate },
        checkOut: { $gte: endDate }
      }
    ]
  })
}

BookingSchema.statics.getRevenue = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        bookingStatus: { $ne: 'Cancelled' },
        paymentStatus: 'Paid'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalBookings: { $sum: 1 },
        averageBookingValue: { $avg: '$totalAmount' }
      }
    }
  ])
}

// Instance methods
BookingSchema.methods.cancel = function(reason: string) {
  this.bookingStatus = 'Cancelled'
  this.cancellationReason = reason
  this.cancellationDate = new Date()
  return this.save()
}

BookingSchema.methods.checkInGuest = function() {
  this.bookingStatus = 'Checked-In'
  return this.save()
}

BookingSchema.methods.checkOutGuest = function() {
  this.bookingStatus = 'Checked-Out'
  return this.save()
}

BookingSchema.methods.updatePaymentStatus = function(status: string, paymentId?: string) {
  this.paymentStatus = status
  if (paymentId) this.paymentId = paymentId
  return this.save()
}

// Export model
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking