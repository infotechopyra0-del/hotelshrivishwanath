import mongoose from "mongoose";

if (mongoose.models.Room) {
  delete mongoose.models.Room;
}

const RoomSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Room image is required"],
      validate: {
        validator: function(value: any) {
          if (typeof value === 'string') return true;
          if (typeof value === 'object' && value.url) return true;
          return false;
        },
        message: 'Image must be a URL string or object with url'
      }
    },

    title: {
      type: String,
      required: [true, "Room title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    
    description: {
      type: String,
      required: [true, "Room description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Standard Rooms",
        "Deluxe Rooms",
        "Premium Rooms",
        "Suites",
        "Family Rooms",
        "Honeymoon Suite",
        "Other",
      ],
      default: "Standard Rooms",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    bedType: {
      type: String,
      enum: ["Single", "Double", "Queen", "King", "Twin"],
      default: "Double",
    },
    
    maxOccupancy: {
      type: Number,
      default: 2,
      min: [1, "Occupancy must be at least 1"],
    },
    
    amenities: {
      type: [String],
      default: [],
    },
  
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
      default: "ACTIVE",
    },
    
    isAvailable: {
      type: Boolean,
      default: true,
    },
    
    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({ category: 1, status: 1 });
RoomSchema.index({ featured: -1, order: 1 });
RoomSchema.index({ price: 1 });
RoomSchema.index({ isAvailable: 1 });

const Room = mongoose.model("Room", RoomSchema);

export default Room;