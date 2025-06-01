import express from "express"
import Joi from "joi"
import { Recommendation } from "../models/Recommendation"
import { Property } from "../models/Property"
import { User } from "../models/User"
import { authenticate, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Validation schema
const recommendationSchema = Joi.object({
  toUserEmail: Joi.string().email().required(),
  propertyId: Joi.string().required(),
  message: Joi.string().optional(),
})

// Send recommendation
router.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { error } = recommendationSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { toUserEmail, propertyId, message } = req.body

    // Find recipient user
    const toUser = await User.findOne({ email: toUserEmail })
    if (!toUser) {
      return res.status(404).json({ error: "User not found with this email" })
    }

    // Check if property exists
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }

    // Check if user is trying to recommend to themselves
    if (toUser._id.toString() === req.user!._id.toString()) {
      return res.status(400).json({ error: "Cannot recommend property to yourself" })
    }

    // Check if already recommended
    const existingRecommendation = await Recommendation.findOne({
      fromUserId: req.user!._id,
      toUserId: toUser._id,
      propertyId,
    })

    if (existingRecommendation) {
      return res.status(400).json({ error: "Property already recommended to this user" })
    }

    const recommendation = new Recommendation({
      fromUserId: req.user!._id,
      toUserId: toUser._id,
      propertyId,
      message,
    })

    await recommendation.save()
    await recommendation.populate([
      { path: "fromUserId", select: "name email" },
      { path: "toUserId", select: "name email" },
      {
        path: "propertyId",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      },
    ])

    res.status(201).json({
      message: "Property recommended successfully",
      recommendation,
    })
  } catch (error) {
    next(error)
  }
})

// Get received recommendations
router.get("/received", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const filter: any = { toUserId: req.user!._id }
    if (isRead !== undefined) {
      filter.isRead = isRead === "true"
    }

    const recommendations = await Recommendation.find(filter)
      .populate([
        { path: "fromUserId", select: "name email" },
        {
          path: "propertyId",
          populate: {
            path: "createdBy",
            select: "name email",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Recommendation.countDocuments(filter)

    res.json({
      recommendations,
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

// Get sent recommendations
router.get("/sent", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const recommendations = await Recommendation.find({ fromUserId: req.user!._id })
      .populate([
        { path: "toUserId", select: "name email" },
        {
          path: "propertyId",
          populate: {
            path: "createdBy",
            select: "name email",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Recommendation.countDocuments({ fromUserId: req.user!._id })

    res.json({
      recommendations,
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

// Mark recommendation as read
router.patch("/:id/read", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      toUserId: req.user!._id,
    })

    if (!recommendation) {
      return res.status(404).json({ error: "Recommendation not found" })
    }

    recommendation.isRead = true
    await recommendation.save()

    res.json({ message: "Recommendation marked as read" })
  } catch (error) {
    next(error)
  }
})

// Delete recommendation
router.delete("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      $or: [{ fromUserId: req.user!._id }, { toUserId: req.user!._id }],
    })

    if (!recommendation) {
      return res.status(404).json({ error: "Recommendation not found" })
    }

    await Recommendation.findByIdAndDelete(req.params.id)

    res.json({ message: "Recommendation deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
