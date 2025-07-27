const {
  calculateFine,
  getFinesByUser,
  payFine
} = require('../services/fineServices')

exports.calculateBookingFine = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { actualReturnDate } = req.body

    const result = await calculateFine(
      bookingId,
      actualReturnDate ? new Date(actualReturnDate) : undefined
    )

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

exports.getUserFines = async (req, res) => {
  try {
    const fines = await getFinesByUser(req.user._id)

    if (!fines) {
      throw 'fine doesnot exits'
    }
    res.status(200).json({
      success: true,
      data: fines
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

exports.payUserFine = async (req, res) => {
  try {
    const { fineId } = req.params

    const paidFine = await payFine(fineId)

    if (!paidFine) {
      return res.status(404).json({
        success: false,
        message: 'Fine not found'
      })
    }

    res.status(200).json({
      success: true,
      data: paidFine
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}
