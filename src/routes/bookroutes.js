const express = require('express')
const {
  getAllBookings,
  updateBookingStatus,
  getBookingsByUser,
  createBooking,
  getBookingById,
  cancelBooking,
  extendBooking,
  getOwnBooking,
  RejectBooking,
  confirmBooking,
  completedBooking
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
router.delete('/cancel/:id', auth, cancelBooking)
router.put('/extend/:id', auth, extendBooking)
router.get('/get-book-vehicle', auth, roleBasedAuth('MERCHANT'), getOwnBooking)
router.patch(
  '/cancel-booking/:id',
  auth,
  roleBasedAuth('MERCHANT'),
  RejectBooking
)

router.patch(
  '/cancel-booking/:id',
  auth,
  roleBasedAuth('MERCHANT'),
  cancelBooking
)

router.patch(
  '/confirm-booking/:id',
  auth,
  roleBasedAuth('MERCHANT'),
  confirmBooking
)

router.patch(
  '/completed-booking/:id',
  auth,
  roleBasedAuth('MERCHANT'),
  completedBooking
)
module.exports = router
