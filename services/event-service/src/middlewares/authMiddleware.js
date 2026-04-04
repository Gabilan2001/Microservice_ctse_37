import {
  extractAccessToken,
  verifyUserWithAuthService
} from "../services/authService.js"

export const protect = async (req, res, next) => {
  try {
    const token = extractAccessToken(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token missing"
      })
    }

    const verification = await verifyUserWithAuthService(token)

    if (!verification.isVerified) {
      return res.status(verification.statusCode || 401).json({
        success: false,
        message: verification.message || "Unauthorized"
      })
    }

    const user = verification.user || {}

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
