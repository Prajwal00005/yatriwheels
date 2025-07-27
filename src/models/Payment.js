const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'FAILED'],
    default: 'PENDING'
  },
  khaltiPidx: { type: String }, // Store Khalti transaction ID
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Payment', paymentSchema)
