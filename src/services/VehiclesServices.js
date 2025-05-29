const Vehicle = require('../models/Vehicles')

exports.createVehicle = async (data, userId, file) => {
  // console.log(data)
  const response = await Vehicle.create({
    ...data,
    createdBy: userId,
    imageURL: file.path
  })

  console.log(response)

  return response
}

exports.updateVehicle = async (id, data) => {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(id, data, {
    new: true
  })

  return updatedVehicle
}

exports.getVehicles = async query => {
  const sort = JSON.parse(query.sort || '{} ')
  const limit = query.limit || 10
  const offset = query.offset

  const { categorys, name, minPrice } = query

  const filters = {}

  if (minPrice) filters.minPrice = { $gt: minPrice }

  if (categorys) {
    const categoryItems = categorys

    filters.category = { $in: categoryItems }
  }
  if (name) {
    filters.name = {
      $regex: name,
      $options: 'i'
    }
  }

  const vehicles = await Vehicle.find(filters) // Apply filters to the query
    .populate('createdBy', ['name']) // Populate the 'createdBy' field, which is the correct name
    .sort(sort) // Sort the results based on your sort parameter
    .limit(limit) // Limit the number of documents returned
    .skip(offset)
    .where('vehicleStatus', true)
  // Skip documents based on offset (for pagination)

  return vehicles
}

exports.getVehiclesById = async id => {
  return await Vehicle.findById(id)
}

exports.deleteVehicle = async id => {
  return await Vehicle.findByIdAndDelete(id)
}

exports.getVehiclesByUserId = async userId => {
  try {
    const vehicles = await Vehicle.find({ createdBy: userId }).exec()
    return vehicles
  } catch (error) {
    throw new Error('Failed to fetch vehicles by user')
  }
}
