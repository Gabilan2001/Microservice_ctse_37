//booking controller for booking service
const Booking = require("../models/Booking")
const { getEventById, updateEventById } = require("../services/eventService")

function serializeBooking(booking) {
  const o = booking.toObject ? booking.toObject() : { ...booking }
  if (o.status === "BOOKED" || o.status == null || o.status === "") {
    o.status = "confirmed"
  }
  return o
}

function seatHeldQuery(eventId) {
  return { eventId, status: { $ne: "cancelled" } }
}

exports.createBooking = async (req,res)=>{

try{

const {eventId,seatNumbers} = req.body
const authorizationHeader = req.headers.authorization

if (!req.user?.id) {
return res.status(401).json({message:"Unauthorized"})
}

if (!eventId) {
return res.status(400).json({message:"eventId is required"})
}

if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
return res.status(400).json({message:"Please select at least one seat"})
}

const event = await getEventById(eventId, authorizationHeader)

if (!event) {
return res.status(404).json({message:"Event not found"})
}

const invalidSeat = seatNumbers.find((seat) => seat < 1 || seat > event.totalSeats)

if (invalidSeat) {
return res.status(400).json({message:"One or more seat numbers are invalid"})
}

const existingBookings = await Booking.find(seatHeldQuery(eventId))

const bookedSeats = new Set(
existingBookings.flatMap((booking) => booking.seatNumbers || [])
)

const alreadyBookedSeat = seatNumbers.find((seat) => bookedSeats.has(seat))

if (alreadyBookedSeat) {
return res.status(409).json({message:`Seat ${alreadyBookedSeat} is already booked`})
}

const seats = seatNumbers.length

const booking = new Booking({
userId:req.user.id,
userEmail:req.user.email || null,
userName:req.user.name || null,
userRole:req.user.role || null,
eventId,
seats,
seatNumbers,
status:"pending"
})

await booking.save()

await updateEventById(eventId, {
availableSeats: Math.max(0, event.availableSeats - seats)
}, authorizationHeader)

res.status(201).json(serializeBooking(booking))

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.getBookings = async(req,res)=>{

try{

const filter = ["admin","organizer"].includes(req.user?.role) ? {} : { userId: req.user.id }
const bookings = await Booking.find(filter)

res.json(bookings.map(serializeBooking))

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.getBookedSeatsByEvent = async (req,res)=>{

try{

const { eventId } = req.params

const bookings = await Booking.find(seatHeldQuery(eventId))

const seatNumbers = bookings.flatMap((booking) => booking.seatNumbers || [])

res.json({ seatNumbers })

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.cancelBooking = async(req,res)=>{

try{

const booking = await Booking.findById(req.params.id)

if (!booking) {
return res.status(404).json({message:"Booking not found"})
}

if (req.user.role !== "admin" && booking.userId !== req.user.id) {
return res.status(403).json({message:"Forbidden"})
}

if (booking.status === "cancelled") {
return res.status(400).json({message:"Booking already cancelled"})
}

booking.status = "cancelled"
await booking.save()

try {
const event = await getEventById(booking.eventId, req.headers.authorization)
await updateEventById(booking.eventId, {
availableSeats: Math.min(event.totalSeats, event.availableSeats + booking.seats)
}, req.headers.authorization)
} catch (_error) {
// Keep booking cancellation successful even if event-service update fails.
}

res.json({message:"Booking cancelled",booking:serializeBooking(booking)})

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.updateBookingStatus = async (req,res)=>{

try{

const {status} = req.body

if (status !== "confirmed") {
return res.status(400).json({message:"Only status 'confirmed' is allowed"})
}

if (!["admin","organizer"].includes(req.user.role)) {
return res.status(403).json({message:"Forbidden"})
}

const booking = await Booking.findById(req.params.id)

if (!booking) {
return res.status(404).json({message:"Booking not found"})
}

if (booking.status === "cancelled") {
return res.status(400).json({message:"Cannot confirm a cancelled booking"})
}

if (booking.status !== "pending") {
return res.status(400).json({message:"Only pending bookings can be confirmed"})
}

booking.status = "confirmed"
await booking.save()

res.json(serializeBooking(booking))

}catch(error){

res.status(500).json({message:error.message})

}

}