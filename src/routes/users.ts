import express from "express"
import { User } from "../models/User"
import { authenticate, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// Search users by email (for recommendations)
router.get("/search", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ error: "Email query parameter is required" })
    }

    const users = await User.find({
      email: { $regex: email, $options: "i" },
      _id: { $ne: req.user!._id }, // Exclude current user
    })
      .select("name email")
      .limit(10)

    res.json(users)
  } catch (error) {
    next(error)
  }
})

export default router
