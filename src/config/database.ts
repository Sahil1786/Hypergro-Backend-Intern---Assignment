import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async (): Promise<void> => {
  try {
    // Use local MongoDB by default
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/property-listing"

    await mongoose.connect(mongoURI)
    console.log("✅ MongoDB connected successfully")
    console.log(`📍 Connected to: ${mongoURI}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("📡 MongoDB disconnected")
})

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB error:", error)
})
