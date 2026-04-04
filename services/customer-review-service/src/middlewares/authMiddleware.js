const {
  extractAccessToken,
  verifyUserWithAuthService
} = require("../services/authService")

const protect = async (req, res, next) => {
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

const optionalProtect = async (req, res, next) => {
  const token = extractAccessToken(req)

  if (!token) {
    return next()
  }

  try {
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

    return next()
  } catch (error) {
    console.error("Optional auth middleware error:", error)

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

module.exports = {
  protect,
  optionalProtect
}
