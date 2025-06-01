import { createClient } from "redis"
import dotenv from "dotenv"

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
})

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect()
    console.log("✅ Redis connected successfully")
    console.log(`📍 Connected to: ${process.env.REDIS_URL || "redis://127.0.0.1:6379"}`)
  } catch (error) {
    console.error("⚠️ Redis connection failed:", error)
    console.log("📝 Note: Redis is optional. The app will work without caching.")
  }
}

redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error)
})

redisClient.on("disconnect", () => {
  console.log("📡 Redis disconnected")
})

// Helper function to check if Redis is connected
export const isRedisConnected = (): boolean => {
  return redisClient.isOpen
}

export { redisClient }
