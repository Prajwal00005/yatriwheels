const express = require('express')
const { createPayment } = require('../controllers/PaymentController')
const auth = require('../middlewares/auth')
const router = express.Router()

router.post('/payment', auth, createPayment)

module.exports = router
