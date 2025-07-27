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
  const sort = JSON.parse(query.sort || '{}')
  const limit = parseInt(query.limit) || 10
  const offset = parseInt(query.offset) || 0

  const { categorys, name, minPrice, maxPrice } = query

  const filters = {}

  // Handle price range
  if (minPrice || maxPrice) {
    filters.price = {}
    if (minPrice) filters.price.$gte = parseFloat(minPrice)
    if (maxPrice) filters.price.$lte = parseFloat(maxPrice)
  }

  // Handle categories
  if (categorys) {
    const categoryItems = Array.isArray(categorys) ? categorys : [categorys]
    filters.category = { $in: categoryItems }
  }

  // Handle name search
  if (name) {
    filters.name = {
      $regex: name,
      $options: 'i'
    }
  }

  console.log('🚀 Backend Query Params:', query)
  console.log('🚀 Backend Filters Applied:', filters)

  const vehicles = await Vehicle.find(filters)
    .populate('createdBy', ['name'])
    .sort(sort)
    .limit(limit)
    .skip(offset)
    .where('vehicleStatus', true)

  console.log('🚀 Vehicles Found:', vehicles.length, 'vehicles')

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
