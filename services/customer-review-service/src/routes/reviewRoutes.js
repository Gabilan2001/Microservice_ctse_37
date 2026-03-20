const express = require("express")

const router = express.Router()

const { createReview, getReviews, deleteReview } = require("../controllers/reviewController")
const { protect, optionalProtect } = require("../middlewares/authMiddleware")

router.post("/", protect, createReview)
router.get("/", optionalProtect, getReviews)
router.delete("/:id", protect, deleteReview)

module.exports = router
