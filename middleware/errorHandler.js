const errorHandler = (error, req, res, next) => {
  console.error("Error:", error)

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message)
    return res.status(400).json({
      error: "Validation Error",
      details: errors,
    })
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(400).json({
      error: `${field} already exists`,
    })
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" })
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" })
  }

  // MongoDB connection errors
  if (error.name === "MongoNetworkError") {
    return res.status(503).json({ error: "Database connection error" })
  }

  // Default error
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  })
}

module.exports = errorHandler
