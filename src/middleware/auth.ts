import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User, type IUser } from "../models/User"

export interface AuthRequest extends Request {
  user?: IUser
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: "Invalid token." })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token." })
  }
}
