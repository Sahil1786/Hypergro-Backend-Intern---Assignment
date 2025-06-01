const express = require("express")
const mongoose = require("mongoose")
const redis = require("redis")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const propertyRoutes = require("./routes/properties")
const favoriteRoutes = require("./routes/favorites")
const recommendationRoutes = require("./routes/recommendations")
const userRoutes = require("./routes/users")

// Import middleware
const errorHandler = require("./middleware/errorHandler")

const app = express()
const PORT = process.env.PORT || 3000

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
})

// Connect to Redis
async function connectRedis() {
  try {
    await redisClient.connect()
    console.log("✅ Redis connected successfully")
  } catch (error) {
    console.error("⚠️ Redis connection failed:", error.message)
    console.log("📝 Note: App will work without Redis caching")
  }
}

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/property-listing"
    await mongoose.connect(mongoURI)
    console.log("✅ MongoDB connected successfully")
    console.log(`📍 Connected to: ${mongoURI}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Security middleware
app.use(helmet())
app.use(cors())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/recommendations", recommendationRoutes)
app.use("/api/users", userRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 SIGTERM received, shutting down gracefully")
  await mongoose.connection.close()
  if (redisClient.isOpen) {
    await redisClient.quit()
  }
  process.exit(0)
})

// Start server
async function startServer() {
  try {
    await connectDB()
    await connectRedis()

    app.listen(PORT, () => {
      console.log("🚀 Property Listing Backend Server Started")
      console.log("==========================================")
      console.log(`🌐 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔧 Node.js version: ${process.version}`)
      console.log(`💻 Platform: ${process.platform}`)
      console.log(`🕐 Started at: ${new Date().toISOString()}`)
      console.log("==========================================")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Export for testing
module.exports = { app, redisClient }

// Start the server
if (require.main === module) {
  startServer()
}
