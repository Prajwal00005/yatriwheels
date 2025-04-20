const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  Vat: {
    type: Number
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'MOBILEBANKING']
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED']
  },
  BookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
})

const Payment = mongoose.model("Payment",paymentSchema);
module.exports = Payment;