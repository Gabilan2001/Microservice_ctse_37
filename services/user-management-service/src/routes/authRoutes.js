const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  validateToken,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateMyProfile,
  deleteMyProfile,
  deleteUserByAdmin
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [organizer, attendee]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateMyProfile);
router.delete("/profile", protect, deleteMyProfile);

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate JWT token for other services
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 */
router.get("/validate", protect, validateToken);
router.post("/validate", protect, validateToken);

/**
 * @swagger
 * /api/auth/organizer-only:
 *   get:
 *     summary: Organizer only route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome organizer
 */

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/users/:id", protect, authorizeRoles("admin"), getUserById);
router.patch("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUserByAdmin);

router.get(
  "/organizer-only",
  protect,
  authorizeRoles("organizer"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome organizer"
    });
  }
);

/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Admin only route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome admin
 */
router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome admin"
    });
  }
);

module.exports = router;