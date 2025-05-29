const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
