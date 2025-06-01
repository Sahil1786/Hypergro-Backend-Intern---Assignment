import mongoose, { type Document, Schema } from "mongoose"

export interface IRecommendation extends Document {
  fromUserId: mongoose.Types.ObjectId
  toUserId: mongoose.Types.ObjectId
  propertyId: mongoose.Types.ObjectId
  message?: string
  isRead: boolean
  createdAt: Date
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
recommendationSchema.index({ toUserId: 1 })
recommendationSchema.index({ fromUserId: 1 })

export const Recommendation = mongoose.model<IRecommendation>("Recommendation", recommendationSchema)
