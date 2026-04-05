const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({

userId:{
type:String,
required:true
},

userEmail:{
type:String,
default:null
},

userName:{
type:String,
default:null
},

userRole:{
type:String,
default:null
},

eventId:{
type:String,
required:true
},

seats:{
type:Number,
required:true
},

seatNumbers:{
type:[Number],
default:[]
},

status:{
type:String,
enum:["pending","confirmed","cancelled","BOOKED"],
default:"pending"
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Booking",bookingSchema)