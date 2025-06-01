// Pure JavaScript version of the server (alternative to TypeScript)
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const mongoose = require("mongoose")
const { createClient } = require("redis")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(cors())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
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

// Redis connection (optional)
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
})

async function connectRedis() {
  try {
    await redisClient.connect()
    console.log("✅ Redis connected successfully")
  } catch (error) {
    console.error("⚠️ Redis connection failed:", error)
    console.log("📝 Note: Redis is optional. The app will work without caching.")
  }
}

// Routes (you would import these from separate files in a real app)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
  })
})

// Basic property route example
app.get("/api/properties", async (req, res) => {
  try {
    // This would use your Property model
    res.json({
      message: "Properties endpoint working",
      note: "Use the TypeScript version for full functionality",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
async function startServer() {
  try {
    await connectDB()
    await connectRedis()

    app.listen(PORT, () => {
      console.log(`🚀 Node.js server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔧 Node.js version: ${process.version}`)
      console.log(`💻 Platform: ${process.platform}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app
