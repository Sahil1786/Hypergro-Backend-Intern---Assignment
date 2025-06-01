const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["apartment", "house", "condo", "townhouse", "villa", "studio", "other"],
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
propertySchema.index({ location: 1 })
propertySchema.index({ propertyType: 1 })
propertySchema.index({ price: 1 })
propertySchema.index({ bedrooms: 1 })
propertySchema.index({ bathrooms: 1 })
propertySchema.index({ status: 1 })
propertySchema.index({ createdBy: 1 })

module.exports = mongoose.model("Property", propertySchema)
