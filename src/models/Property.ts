import mongoose, { type Document, Schema } from "mongoose"

export interface IProperty extends Document {
  title: string
  description: string
  price: number
  location: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  images: string[]
  status: "available" | "sold" | "rented"
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const propertySchema = new Schema<IProperty>(
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
      type: Schema.Types.ObjectId,
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

export const Property = mongoose.model<IProperty>("Property", propertySchema)
