const Booking = require('../models/Book')
const Fine = require('../models/Fine')

async function calculateFine (bookingId, actualReturnDate = new Date()) {
  // Get the booking with populated vehicle and user
  const booking = await Booking.findById(bookingId)
    .populate('vehicle')
    .populate('user')

  if (!booking) {
    throw new Error('Booking not found')
  }

  const dueDate = booking.endDate
  const returnDate = actualReturnDate

  // Check if vehicle was returned on time
  if (returnDate <= dueDate) {
    // No fine
    booking.actualReturnDate = returnDate
    booking.fine = 0
    await booking.save()
    return { fineAmount: 0, booking }
  }

  // Calculate delay in hours and round up
  const timeDifferenceMs = returnDate - dueDate
  const delayHours = Math.ceil(timeDifferenceMs / (1000 * 60 * 60))

  // Calculate fine (20% of vehicle price per hour)
  const fineRatePerHour = booking.vehicle.price * 0.2
  const fineAmount = delayHours * fineRatePerHour

  // Update booking
  booking.actualReturnDate = returnDate
  booking.fine = fineAmount
  booking.status = 'completed'
  await booking.save()

  // Create fine record
  const fine = await Fine.create({
    booking: booking._id,
    user: booking.user._id,
    vehicle: booking.vehicle._id,
    dueDate,
    returnDate,
    delayHours,
    fineRatePerHour,
    amount: fineAmount
  })

  return { fineAmount, fine, booking }
}

async function getFinesByUser (userId) {
  return Fine.find({ user: userId }).populate('booking').populate('vehicle')
}

async function payFine (fineId) {
  return Fine.findByIdAndUpdate(fineId, { isPaid: true }, { new: true })
}

module.exports = {
  calculateFine,
  getFinesByUser,
  payFine
}
