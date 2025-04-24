const vehicleServices = require('../services/VehiclesServices')

exports.createVehicle = async (req, res) => {
  try {
    const userId = req.user.id
    const data = JSON.parse(JSON.stringify(req.body))

    // console.log(userId)
    // console.log(req.file)

    const response = await vehicleServices.createVehicle(data, userId, req.file)

    // console.log(response)
    if (!response) return res.status(404).send("Vehicles didn't created ")

    res.status(200).json({
      sucess: 'OK',
      message: 'Product created sucessfully',
      data: response
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      sucess: false,
      message: e.message
    })
  }
}

exports.Vehicle = async (req, res) => {
  try {
    const vehicle = await vehicleServices.getVehicles(req.query)

    if (!vehicle) res.status(404).send('vehicles not found')

    res.status(200).json({
      sucess: 'OK',
      message: 'Product Fetched sucessfully',
      data: vehicle
    })
  } catch (e) {
    res.status(400).json({
      sucess: false,
      message: e.message
    })
  }
}

exports.VehicleById = async (req, res) => {
  try {
    const id = req.params.id

    const vehicle = await vehicleServices.getVehiclesById(id)

    if (!vehicle) res.status(404).send('vehicles not found')

    res.status(200).json({
      sucess: 'OK',
      message: 'Product Fetched sucessfully',
      data: vehicle
    })
  } catch (e) {
    res.status(400).json({
      sucess: false,
      message: e.message
    })
  }
}
exports.updateVehicle = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user.id

    const product = await vehicleServices.getVehiclesById(id)

    if (!product) res.status(400).send('products not Found')
    console.log(product.createdBy)
    console.log(userId)

    if (product.createdBy != userId && !user.roles.includes('ADMIN'))
      res.status(403).send('access denied')

    const response = await vehicleServices.updateVehicle(req.body, id)

    if (!response) return res.status(404).send('products update failed')

    res.status(200).json({
      sucess: 'OK',
      message: 'Product updated sucessfully',
      data: response
    })
  } catch (e) {
    res.status(400).json({
      sucess: false,
      message: e.message
    })
  }
}

exports.deleteVehicle = async (req, res) => {
  try {
    const id = req.params.id
    const user = req.user

    const Product = await vehicleServices.getVehiclesById(id)

    if (!Product) return res.status(400).send('Not found')
    console.log(Product)
    if (Product.createdBy != user.userId && !user.roles.includes('ADMIN'))
      return res.status(403).send('Access denied')

    const response = await vehicleServices.deleteVehicle(id)

    if (!response) res.status(400).send('failed to delete products')

    res.status(200).json({
      sucess: 'OK',
      message: 'Product Deleted sucessfully',
      data: response
    })
  } catch (e) {
    res.status(400).json({
      sucess: false,
      message: e.message
    })
  }
}

exports.getVehiclesByUser = async (req, res) => {
  try {
    const userId = req.user.id

    // Fetch vehicles created by the user
    const vehicles = await vehicleServices.getVehiclesByUserId(userId)

    // Check if vehicles exist
    if (!vehicles || vehicles.length === 0) {
      return res.status(404).send('No vehicles found for this user')
    }

    // Authorization check: ensure user is the creator or an admin
    // Note: Since getVehiclesByUserId already filters by userId, this check is redundant
    // but included for consistency with updateVehicle logic
    const unauthorized = vehicles.some(
      vehicle =>
        vehicle.createdBy.toString() !== userId &&
        !req.user.roles.includes('ADMIN')
    )
    if (unauthorized) {
      return res.status(403).send('Access denied')
    }

    res.status(200).json({
      success: 'OK',
      message: 'Vehicles retrieved successfully',
      data: vehicles
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message || 'Failed to fetch vehicles'
    })
  }
}
