const express = require('express')
const {
  getAllBookings,
  updateBookingStatus,
  getBookingsByUser,
  createBooking,
  getBookingById,
  cancelBooking,
  extendBooking
} = require('../controllers/bookController')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')

const router = express.Router()
// Admin-only routes
router.get('/', auth, roleBasedAuth('ADMIN'), getAllBookings)
router.put('/:id/status', auth, roleBasedAuth('ADMIN'), updateBookingStatus)

// User routes
router.get('/my-bookings', auth, getBookingsByUser)
router.post('/create-booking', auth, createBooking)
router.get('/get-booking/:id', auth, getBookingById)
router.put('/cancel/:id', auth, cancelBooking)
router.put('/extend/:id', auth, extendBooking)

module.exports = router
