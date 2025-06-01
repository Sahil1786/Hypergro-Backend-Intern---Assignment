const express = require("express")
const User = require("../models/User")
const authenticate = require("../middleware/auth")

const router = express.Router()

// Search users by email (for recommendations)
router.get("/search", authenticate, async (req, res, next) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ error: "Email query parameter is required" })
    }

    const users = await User.find({
      email: { $regex: email, $options: "i" },
      _id: { $ne: req.user._id }, // Exclude current user
    })
      .select("name email")
      .limit(10)

    res.json(users)
  } catch (error) {
    next(error)
  }
})

module.exports = router
