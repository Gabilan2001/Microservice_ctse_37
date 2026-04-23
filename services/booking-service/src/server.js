require("dotenv").config()

const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")

const connectDB = require("./config/db")
const swaggerSpec = require("./config/swagger")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())



app.get("/health", (req, res) => {
  res.json({ success: true, message: "Booking service is running!" })
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec)
})


app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`)
})