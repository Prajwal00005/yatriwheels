const mongoose = require('mongoose')
const Payment = require('../models/Payment')
const Booking = require('../models/Book')
const payViaKhalti = require('../utils/khalti')

const createPayment = async data => {
  const { booking, amount, returnUrl, websiteUrl, orderName, customerInfo } =
    data

  // Validate booking ID
  if (!mongoose.isValidObjectId(booking)) {
    throw new Error('Invalid booking ID')
  }

  // Check if booking exists
  const bookingExists = await Booking.findById(booking)
  if (!bookingExists) {
    throw new Error('Booking not found')
  }

  // Check if payment already exists for this booking
  const existingPayment = await Payment.findOne({ booking })
  if (existingPayment) {
    throw new Error('Payment already exists for this booking')
  }

  // Initiate Khalti payment
  const khaltiResponse = await payViaKhalti({
    returnUrl,
    websiteUrl,
    amount: amount * 100, // Convert to paisa (Khalti expects amount in paisa)
    orderId: booking,
    orderName,
    customerInfo
  })

  // Create payment in database
  const payment = new Payment({
    booking,
    amount,
    status: 'PENDING',
    khaltiPidx: khaltiResponse.pidx // Store Khalti transaction ID
  })
  await payment.save()

  await payment.populate({
    path: 'booking',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'vehicle', select: 'name model' }
    ]
  })

  return {
    payment,
    paymentUrl: khaltiResponse.payment_url // Return payment URL for redirection
  }
}

const getPayments = async () => {
  return await Payment.find().populate({
    path: 'booking',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'vehicle', select: 'name model' }
    ]
  })
}

const getPaymentById = async id => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Invalid payment ID')
  }

  const payment = await Payment.findById(id).populate({
    path: 'booking',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'vehicle', select: 'name model' }
    ]
  })

  if (!payment) {
    throw new Error('Payment not found')
  }

  return payment
}

const updatePayment = async (id, updateData) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Invalid payment ID')
  }

  const payment = await Payment.findById(id)
  if (!payment) {
    throw new Error('Payment not found')
  }

  Object.assign(payment, updateData)
  await payment.save()

  await payment.populate({
    path: 'booking',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'vehicle', select: 'name model' }
    ]
  })

  return payment
}

const confirmPayment = async (bookingId, status) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new Error('Invalid booking ID')
  }

  const payment = await Payment.findOne({ booking: bookingId })
  if (!payment) {
    throw new Error('Payment not found')
  }

  payment.status = status
  await payment.save()

  await payment.populate({
    path: 'booking',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'vehicle', select: 'name model' }
    ]
  })

  return payment
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  confirmPayment
}
