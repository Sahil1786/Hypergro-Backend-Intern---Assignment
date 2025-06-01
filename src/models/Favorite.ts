import mongoose, { type Document, Schema } from "mongoose"

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId
  propertyId: mongoose.Types.ObjectId
  createdAt: Date
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure unique user-property combinations
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true })

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema)
