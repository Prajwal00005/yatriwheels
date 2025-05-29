const Booking = require('../models/Book')
const crypto = require('crypto')
const vehicle = require('../models/Vehicles')

const getAllBookings = async query => {
  return await Booking.find({
    status: query.status || 'pending'
  })
    .sort({ createdAt: -1 })
    .populate('vehicle')
    .populate('user', ['name', 'email', 'phone'])
}

const getBookingsByUser = async (userId, query) => {
  return await Booking.find({
    user: userId,
    status: query?.status || 'pending'
  })
    .sort({ createdAt: -1 })
    .populate('vehicle')
    .populate('user', ['name', 'email', 'phone'])
}

const getBookingById = async id => {
  const booking = await Booking.findById(id)
    .populate('vehicle')
    .populate('user', ['name', 'email', 'phone'])

  if (!booking) {
    throw {
      statusCode: 404,
      message: 'Booking not found.'
    }
  }

  return booking
}

const createBooking = async data => {
  data.bookingNumber = `BK-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`

  // Validate date range
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    throw {
      statusCode: 400,
      message: 'End date must be after start date'
    }
  }

  return await Booking.create(data)
}

const updateBookingStatus = async (id, status) => {
  return await Booking.findByIdAndUpdate(id, status, { new: true }).populate(
    'vehicle'
  )
}

const cancelBooking = async id => {
  return await Booking.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true }
  )
}

const getOwnBooking = async data => {
  const booking = await Booking.find()
    .populate('vehicle')
    .populate('user', ['name', 'email', 'phone'])

  // if(data.vehicle)
  return booking
}

module.exports = {
  getAllBookings,
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getOwnBooking
}
