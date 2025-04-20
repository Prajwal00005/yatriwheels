const bookingService = require("../services/bookServices"); // Fixed file name

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings(req.query);
    res.json(bookings);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  const id = req.user.id;
  try {
    const bookings = await bookingService.getBookingsByUser(id);
    res.json(bookings);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(error.statusCode || 404).json({ message: error.message || "Booking not found" });
  }
};

exports.createBooking = async (req, res) => {
  const input = { ...req.body, user: req.body.user || req.user.id };

  console.log(req.user)
  // Validation
  if (!input.vehicle) return res.status(422).json({ message: "Vehicle is required" });
  if (!input.startDate || !input.endDate) return res.status(422).json({ message: "Dates are required" });
  if (new Date(input.startDate) < new Date()) return res.status(422).json({ message: "Start date cannot be past" });
  if (new Date(input.endDate) <= new Date(input.startDate)) return res.status(422).json({ message: "End date must be after start" });
  if (!input.pickupLocation) return res.status(422).json({ message: "Pickup location required" });

  try {
    const booking = await bookingService.createBooking(input);
    res.status(201).json(booking);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    console.log(error)
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    if (!req.body.status) return res.status(422).json({ message: "Status is required" });
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    res.json(booking);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.extendBooking = async (req, res) => {
  try {
    if (!req.body.newEndDate) return res.status(422).json({ message: "New end date required" });
    
    const booking = await bookingService.getBookingById(req.params.id);
    if (new Date(req.body.newEndDate) <= new Date(booking.endDate)) {
      return res.status(422).json({ message: "New end date must be after current" });
    }
    
    const updatedBooking = await bookingService.extendBooking(req.params.id, req.body.newEndDate);
    res.json(updatedBooking);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};