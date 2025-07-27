const paymentServices = require('../services/paymentServices')

const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { amount, returnUrl, websiteUrl, orderName, customerInfo } = req.body

    const data = {
      booking: bookingId,
      amount,
      returnUrl,
      websiteUrl,
      orderName,
      customerInfo
    }

    const { payment, paymentUrl } = await paymentServices.createPayment(data)

    res.status(201).json({
      success: 'OK',
      message: 'Payment initiated successfully',
      data: {
        payment,
        paymentUrl // URL for client to redirect to Khalti payment page
      }
    })
  } catch (e) {
    res.status(400).json({
      success: 'false',
      message: e.message
    })
  }
}

const getPayments = async (req, res) => {
  try {
    const payments = await paymentServices.getPayments()

    res.status(200).json({
      success: 'OK',
      message: 'Payments retrieved successfully',
      data: payments
    })
  } catch (e) {
    res.status(400).json({
      success: 'false',
      message: e.message
    })
  }
}

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params
    const payment = await paymentServices.getPaymentById(id)

    res.status(200).json({
      success: 'OK',
      message: 'Payment retrieved successfully',
      data: payment
    })
  } catch (e) {
    res.status(e.message === 'Payment not found' ? 404 : 400).json({
      success: 'false',
      message: e.message
    })
  }
}

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const payment = await paymentServices.updatePayment(id, updateData)

    res.status(200).json({
      success: 'OK',
      message: 'Payment updated successfully',
      data: payment
    })
  } catch (e) {
    res.status(e.message === 'Payment not found' ? 404 : 400).json({
      success: 'false',
      message: e.message
    })
  }
}

const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body
    const payment = await paymentServices.confirmPayment(bookingId, status)

    res.status(200).json({
      success: 'OK',
      message: 'Payment status updated successfully',
      data: payment
    })
  } catch (e) {
    res.status(e.message === 'Payment not found' ? 404 : 400).json({
      success: 'false',
      message: e.message
    })
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  confirmPayment
}
