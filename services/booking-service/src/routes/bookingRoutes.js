const express = require("express")
const multer = require("multer")

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

const {
createBooking,
getBookings,
getBookedSeatsByEvent,
cancelBooking,
updateBookingStatus
} = require("../controllers/bookingController")
const { protect } = require("../middlewares/authMiddleware")
const {
uploadBannerImage,
getBanner,
updateBanner
} = require("../controllers/bannerController")

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - seatNumbers
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 6808bf47a90881efe7f51000
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       409:
 *         description: Seat already booked
 */
router.post("/", protect, createBooking)

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings (admin/organizer sees all, attendee sees own)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getBookings)

/**
 * @swagger
 * /api/bookings/banner/upload:
 *   post:
 *     summary: Upload booking service banner image
 *     tags: [Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner image uploaded
 *       400:
 *         description: Missing image file
 */
router.post("/banner/upload", upload.single("image"), uploadBannerImage)

/**
 * @swagger
 * /api/bookings/banner:
 *   get:
 *     summary: Get current booking banner image
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: Current banner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 */
router.get("/banner", getBanner)

/**
 * @swagger
 * /api/bookings/banner:
 *   put:
 *     summary: Update booking banner image URL
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BannerRequest'
 *     responses:
 *       200:
 *         description: Banner updated
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
router.put("/banner", protect, updateBanner)

/**
 * @swagger
 * /api/bookings/event/{eventId}/seats:
 *   get:
 *     summary: Get reserved seat numbers for an event
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserved seat numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seatNumbers:
 *                   type: array
 *                   items:
 *                     type: number
 */
router.get("/event/:eventId/seats",getBookedSeatsByEvent)

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (only supports confirmed)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingStatusUpdateRequest'
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.patch("/:id/status", protect, updateBookingStatus)

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", protect, cancelBooking)

module.exports = router