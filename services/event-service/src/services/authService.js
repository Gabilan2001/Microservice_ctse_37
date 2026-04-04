import axios from "axios"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001"

const authClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000
})

export const extractAccessToken = (req) => {
  const tokenFromCookie = req?.cookies?.accessToken
  if (tokenFromCookie) {
    return tokenFromCookie
  }

  const rawCookieHeader = req?.headers?.cookie || ""
  const tokenCookie = rawCookieHeader
    .split(";")
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith("accessToken="))

  if (tokenCookie) {
    return decodeURIComponent(tokenCookie.split("=")[1] || "")
  }

  const authorization = req?.headers?.authorization || ""
  if (authorization.startsWith("Bearer ")) {
    return authorization.split(" ")[1]
  }

  return null
}

export const verifyUserWithAuthService = async (token) => {
  try {
    const response = await authClient.get(
      "/api/auth/validate",
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: () => true
      }
    )

    const payload = response?.data

    if (response.status >= 400 || payload?.success === false || payload?.error) {
      return {
        isVerified: false,
        statusCode: 401,
        message: payload?.message || "Unauthorized"
      }
    }

    return {
      isVerified: true,
      user: payload?.data || null,
      message: payload?.message || "Token is valid"
    }
  } catch (error) {
    const isTimeout = error?.code === "ECONNABORTED"

    return {
      isVerified: false,
      statusCode: 503,
      message: isTimeout
        ? "Authentication service timeout during verification"
        : "Authentication service unavailable"
    }
  }
}
