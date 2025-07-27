const express = require('express')
const paymentController = require('../controllers/PaymentController')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')

const router = express.Router()

// Create a payment for a specific booking - authenticated users
router.post('/checkout/:bookingId', auth, paymentController.createPayment)

// Confirm payment status - admin or merchant can confirm
router.patch(
  '/confirm/:bookingId',
  auth,
  roleBasedAuth(['ADMIN', 'MERCHANT']),
  paymentController.confirmPayment
)

// Get all payments - admin only
router.get('/', auth, roleBasedAuth(['ADMIN']), paymentController.getPayments)

// Get a payment by its ID - admin or merchant
router.get(
  '/:id',
  auth,
  roleBasedAuth(['ADMIN', 'MERCHANT']),
  paymentController.getPaymentById
)

// Update a payment by its ID - admin or merchant
router.patch(
  '/:id',
  auth,
  roleBasedAuth(['ADMIN', 'MERCHANT']),
  paymentController.updatePayment
)

module.exports = router
