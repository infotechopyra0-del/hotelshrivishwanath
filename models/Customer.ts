import mongoose, { Schema, Document, CallbackError } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface ICustomer extends Document {
  name: string
  email: string
  password: string
  phone: string
  role: 'user' | 'admin'
  isVerified: boolean
  emailVerificationToken?: string
  otpCode?: string
  otpExpires?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  address: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  dateOfBirth?: Date
  gender?: 'Male' | 'Female' | 'Other'
  idType?: 'Aadhar' | 'Passport' | 'Driving License' | 'Voter ID'
  idNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  preferences?: {
    roomType?: string
    bedType?: string
    floorPreference?: string
    dietaryRequirements?: string[]
    specialRequests?: string
  }
  profileImage?: string
  loyaltyPoints: number
  totalBookings: number
  totalSpent: number
  status: 'Active' | 'Inactive' | 'VIP' | 'Blacklisted'
  lastVisit?: Date
  bookings: mongoose.Types.ObjectId[]
  reviews: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// Customer Schema
const CustomerSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    required: false,
    match: [/^[+]?[\s./0-9]*[(]?[\s./0-9]*[)]?[-\s./0-9]*$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  otpCode: String,
  otpExpires: Date,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value < new Date()
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  idType: {
    type: String,
    enum: ['Aadhar', 'Passport', 'Driving License', 'Voter ID']
  },
  idNumber: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  preferences: {
    roomType: String,
    bedType: String,
    floorPreference: String,
    dietaryRequirements: [String],
    specialRequests: String
  },
  profileImage: {
    type: String,
    default: '/images/userdefault.jpeg'
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  totalBookings: {
    type: Number,
    default: 0,
    min: [0, 'Total bookings cannot be negative']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'VIP', 'Blacklisted'],
    default: 'Active'
  },
  lastVisit: Date,
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for customer tier based on total spent
CustomerSchema.virtual('tier').get(function(this: ICustomer) {
  if (this.totalSpent >= 100000) return 'Platinum'
  if (this.totalSpent >= 50000) return 'Gold'
  if (this.totalSpent >= 20000) return 'Silver'
  return 'Bronze'
})

// Virtual for age
CustomerSchema.virtual('age').get(function(this: ICustomer) {
  if (!this.dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

// Index for efficient queries
// Email index is already created via unique: true in schema definition above
CustomerSchema.index({ phone: 1 })
CustomerSchema.index({ status: 1 })
CustomerSchema.index({ totalSpent: -1 })
CustomerSchema.index({ lastVisit: -1 })

// Pre-save middleware to hash password and update status
CustomerSchema.pre('save', async function(this: ICustomer, next) {
  // Hash password if it's modified
  if (this.isModified('password')) {
    const saltRounds = 12
    this.password = await bcrypt.hash(this.password, saltRounds)
  }

  // Auto-update to VIP if spent more than 50000
  if (this.totalSpent >= 50000 && this.status === 'Active') {
    this.status = 'VIP'
  }
  
  if (this.lastVisit && this.status === 'Active') {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    
    if (this.lastVisit < twoYearsAgo) {
      this.status = 'Inactive'
    }
  }
})

// Static methods
CustomerSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

CustomerSchema.statics.findByPhone = function(phone: string) {
  return this.findOne({ phone })
}

CustomerSchema.statics.getVIPCustomers = function() {
  return this.find({ status: 'VIP' }).sort({ totalSpent: -1 })
}

CustomerSchema.statics.getTopCustomers = function(limit: number = 10) {
  return this.find({ status: { $ne: 'Blacklisted' } })
    .sort({ totalSpent: -1 })
    .limit(limit)
}

// Instance methods
CustomerSchema.methods.addLoyaltyPoints = function(points: number) {
  this.loyaltyPoints += points
  return this.save()
}

CustomerSchema.methods.redeemLoyaltyPoints = function(points: number) {
  if (this.loyaltyPoints >= points) {
    this.loyaltyPoints -= points
    return this.save()
  }
  throw new Error('Insufficient loyalty points')
}

CustomerSchema.methods.updateSpending = function(amount: number) {
  this.totalSpent += amount
  this.lastVisit = new Date()
  return this.save()
}

CustomerSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}

CustomerSchema.methods.createPasswordResetToken = function() {
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  this.passwordResetToken = resetToken
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  
  return resetToken
}

// Export model
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema)

export default Customer