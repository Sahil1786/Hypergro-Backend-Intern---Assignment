const express = require("express")
const Favorite = require("../models/Favorite")
const Property = require("../models/Property")
const authenticate = require("../middleware/auth")

const router = express.Router()

// Get user's favorites
router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: "propertyId",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Favorite.countDocuments({ userId: req.user._id })

    res.json({
      favorites,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

// Add to favorites
router.post("/:propertyId", authenticate, async (req, res, next) => {
  try {
    const { propertyId } = req.params

    // Check if property exists
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      propertyId,
    })

    if (existingFavorite) {
      return res.status(400).json({ error: "Property already in favorites" })
    }

    const favorite = new Favorite({
      userId: req.user._id,
      propertyId,
    })

    await favorite.save()
    await favorite.populate({
      path: "propertyId",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    })

    res.status(201).json(favorite)
  } catch (error) {
    next(error)
  }
})

// Remove from favorites
router.delete("/:propertyId", authenticate, async (req, res, next) => {
  try {
    const { propertyId } = req.params

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      propertyId,
    })

    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" })
    }

    res.json({ message: "Property removed from favorites" })
  } catch (error) {
    next(error)
  }
})

// Check if property is favorited
router.get("/check/:propertyId", authenticate, async (req, res, next) => {
  try {
    const { propertyId } = req.params

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      propertyId,
    })

    res.json({ isFavorited: !!favorite })
  } catch (error) {
    next(error)
  }
})

module.exports = router
