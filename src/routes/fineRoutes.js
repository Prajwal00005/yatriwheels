const express = require('express')
const router = express.Router()
const fineController = require('../controllers/FineController')

// Calculate fine for a booking
router.post(
  '/:bookingId/calculate',

  fineController.calculateBookingFine
)

// Get fines for logged-in user
router.get('/my-fines', fineController.getUserFines)

// Pay a fine
router.put('/:fineId/pay', fineController.payUserFine)

module.exports = router
