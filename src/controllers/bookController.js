const bookingService = require('../services/bookServices') // Fixed file name
const vehicleService = require('../services/VehiclesServices')
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings(req.query)
    res.json(bookings)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

exports.getBookingsByUser = async (req, res) => {
  const id = req.user.id
  try {
    const bookings = await bookingService.getBookingsByUser(id)
    res.json(bookings)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

exports.getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id)
    res.json(booking)
  } catch (error) {
    res
      .status(error.statusCode || 404)
      .json({ message: error.message || 'Booking not found' })
  }
}

exports.createBooking = async (req, res) => {
  const input = { ...req.body, user: req.body.user || req.user.id }

  // Validation
  if (!input.vehicle)
    return res.status(422).json({ message: 'Vehicle is required' })
  if (!input.startDate || !input.endDate)
    return res.status(422).json({ message: 'Dates are required' })
  if (new Date(input.startDate) < new Date())
    return res.status(422).json({ message: 'Start date cannot be past' })
  if (new Date(input.endDate) <= new Date(input.startDate))
    return res.status(422).json({ message: 'End date must be after start' })
  if (!input.pickupLocation)
    return res.status(422).json({ message: 'Pickup location required' })

  try {
    const booking = await bookingService.createBooking(input)

    if (booking) {
      await vehicleService.updateVehicle(
        { vehicleStatus: false },
        input.vehicle
      )
    }
    res.status(201).json(booking)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
    console.log(error)
  }
}

exports.updateBookingStatus = async (req, res) => {
  try {
    if (!req.body.status)
      return res.status(422).json({ message: 'Status is required' })
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      req.body.status
    )
    res.json(booking)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id)
    res.json(booking)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

exports.extendBooking = async (req, res) => {
  try {
    if (!req.body.newEndDate)
      return res.status(422).json({ message: 'New end date required' })

    const booking = await bookingService.getBookingById(req.params.id)
    if (new Date(req.body.newEndDate) <= new Date(booking.endDate)) {
      return res
        .status(422)
        .json({ message: 'New end date must be after current' })
    }

    const updatedBooking = await bookingService.extendBooking(
      req.params.id,
      req.body.newEndDate
    )
    res.json(updatedBooking)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

exports.getOwnBooking = async (req, res) => {
  try {
    const user = req.user
    const bookings = await bookingService.getOwnBooking(user)

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No booking or vehicle found' })
    }

    // Filter and map the bookings
    const bookingsList = bookings.filter(booking => {
      return booking?.vehicle?.createdBy.toString() === user.id
    })

    if (bookingsList.length === 0) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.status(200).json({
      success: 'OK',
      message: 'Vehicles retrieved successfully',
      data: bookingsList
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.RejectBooking = async (req, res) => {
  try {
    const id = req.params.id

    const bookings = await bookingService.getBookingById(id)
    if (!bookings) {
      return res.status(400).json({ message: 'Booking not available' })
    }

    console.log('Booking found:', bookings)

    // Set vehicleStatus to FALSE (unavailable) on rejection
    const updatedVehicle = await vehicleService.updateVehicle(
      bookings.vehicle._id,
      {
        vehicleStatus: true
      }
    )
    console.log('Vehicle updated:', updatedVehicle)

    const updatedBooking = await bookingService.updateBookingStatus(id, {
      status: 'cancelled'
    })

    console.log('Booking status updated:', updatedBooking)

    return res.status(200).json({
      message: 'Booking rejected ',
      booking: updatedBooking,
      vehicle: updatedVehicle
    })
  } catch (e) {
    console.error('Error rejecting booking:', e)

    return res.status(500).json({ message: e.message })
  }
}

exports.confirmBooking = async (req, res) => {
  try {
    const id = req.params.id // FIXED

    const bookings = await bookingService.getBookingById(id)

    if (!bookings) {
      return res.status(400).json({ message: 'Booking not available' })
    }

    console.log('Booking found:', bookings)

    // Set vehicle to unavailable
    const updatedVehicle = await vehicleService.updateVehicle(
      bookings.vehicle._id,
      {
        vehicleStatus: false
      }
    )

    // Update booking status to 'confirmed'
    const updatedBooking = await bookingService.updateBookingStatus(id, {
      status: 'confirmed'
    })

    return res.status(200).json({
      message: 'Booking confirmed',
      booking: updatedBooking,
      vehicle: updatedVehicle
    })
  } catch (e) {
    console.error('Error confirming booking:', e)

    return res.status(500).json({ message: e.message })
  }
}

exports.completedBooking = async (req, res) => {
  try {
    const id = req.params.id // FIXED

    const bookings = await bookingService.getBookingById(id)

    if (!bookings) {
      return res.status(400).json({ message: 'Booking not available' })
    }

    console.log('Booking found:', bookings)

    // Set vehicle to unavailable
    const updatedVehicle = await vehicleService.updateVehicle(
      bookings.vehicle._id,
      {
        vehicleStatus: true
      }
    )

    // Update booking status to 'confirmed'
    const updatedBooking = await bookingService.updateBookingStatus(id, {
      status: 'completed'
    })

    return res.status(200).json({
      message: 'Booking completed ',
      booking: updatedBooking,
      vehicle: updatedVehicle
    })
  } catch (e) {
    console.error('Error confirming booking:', e)

    return res.status(500).json({ message: e.message })
  }
}
