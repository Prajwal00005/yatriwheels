const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Sport', 'Suv', 'Comfortable', 'Luxury', 'Compatible'], // Corrected enum
      required: [true, 'Category is required']
    },
    seat: {
      type: Number,
      required: true
    },
    types: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    numberPlate: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 1
    },
    vehicleStatus: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageURL: {
      type: String
    }
  },
  { timestamps: true }
)

const Vehicle = mongoose.model('Vehicle', VehicleSchema)

module.exports = Vehicle
