// models/Fine.js
const mongoose = require('mongoose')

const fineSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
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
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  delayHours: {
    type: Number,
    required: true
  },
  fineRatePerHour: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Fine = mongoose.model('Fine', fineSchema)

module.exports = Fine
