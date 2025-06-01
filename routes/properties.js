const express = require("express")
const Joi = require("joi")
const Property = require("../models/Property")
const authenticate = require("../middleware/auth")
const { redisClient } = require("../server")

const router = express.Router()

// Validation schema
const propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  propertyType: Joi.string().valid("apartment", "house", "condo", "townhouse", "villa", "studio", "other").required(),
  bedrooms: Joi.number().min(0).required(),
  bathrooms: Joi.number().min(0).required(),
  area: Joi.number().min(0).required(),
  amenities: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  status: Joi.string().valid("available", "sold", "rented").default("available"),
})

// Helper function to check Redis connection
const isRedisConnected = () => {
  return redisClient && redisClient.isOpen
}

// Get all properties with advanced filtering
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      status,
      amenities,
      search,
    } = req.query

    // Build filter object
    const filter = {}

    if (location) filter.location = { $regex: location, $options: "i" }
    if (propertyType) filter.propertyType = propertyType
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms)
    if (bathrooms) filter.bathrooms = Number(bathrooms)
    if (minArea || maxArea) {
      filter.area = {}
      if (minArea) filter.area.$gte = Number(minArea)
      if (maxArea) filter.area.$lte = Number(maxArea)
    }
    if (status) filter.status = status
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities]
      filter.amenities = { $in: amenitiesArray }
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    // Create cache key
    const cacheKey = `properties:${JSON.stringify(filter)}:${page}:${limit}`

    // Try to get from cache
    if (isRedisConnected()) {
      try {
        const cachedResult = await redisClient.get(cacheKey)
        if (cachedResult) {
          console.log("📦 Serving from Redis cache")
          return res.json(JSON.parse(cachedResult))
        }
      } catch (cacheError) {
        console.log("⚠️ Cache read error:", cacheError.message)
      }
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get properties
    const properties = await Property.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Property.countDocuments(filter)

    const result = {
      properties,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    }

    // Cache the result for 5 minutes
    if (isRedisConnected()) {
      try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(result))
        console.log("💾 Result cached in Redis")
      } catch (cacheError) {
        console.log("⚠️ Cache set error:", cacheError.message)
      }
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get property by ID
router.get("/:id", async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate("createdBy", "name email")

    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }

    res.json(property)
  } catch (error) {
    next(error)
  }
})

// Create property
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { error } = propertySchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const property = new Property({
      ...req.body,
      createdBy: req.user._id,
    })

    await property.save()
    await property.populate("createdBy", "name email")

    // Clear cache
    if (isRedisConnected()) {
      try {
        const keys = await redisClient.keys("properties:*")
        if (keys.length > 0) {
          await redisClient.del(keys)
          console.log("🗑️ Cache cleared after property creation")
        }
      } catch (cacheError) {
        console.log("⚠️ Cache clear error:", cacheError.message)
      }
    }

    res.status(201).json(property)
  } catch (error) {
    next(error)
  }
})

// Update property
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { error } = propertySchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied. You can only update your own properties.",
      })
    }

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email")

    // Clear cache
    if (isRedisConnected()) {
      try {
        const keys = await redisClient.keys("properties:*")
        if (keys.length > 0) {
          await redisClient.del(keys)
          console.log("🗑️ Cache cleared after property update")
        }
      } catch (cacheError) {
        console.log("⚠️ Cache clear error:", cacheError.message)
      }
    }

    res.json(updatedProperty)
  } catch (error) {
    next(error)
  }
})

// Delete property
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied. You can only delete your own properties.",
      })
    }

    await Property.findByIdAndDelete(req.params.id)

    // Clear cache
    if (isRedisConnected()) {
      try {
        const keys = await redisClient.keys("properties:*")
        if (keys.length > 0) {
          await redisClient.del(keys)
          console.log("🗑️ Cache cleared after property deletion")
        }
      } catch (cacheError) {
        console.log("⚠️ Cache clear error:", cacheError.message)
      }
    }

    res.json({ message: "Property deleted successfully" })
  } catch (error) {
    next(error)
  }
})

module.exports = router
