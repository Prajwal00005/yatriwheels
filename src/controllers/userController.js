// const userServices = require('../services/userServices')
// const User = require('../models/User')

// exports.getUser = async (req, res) => {
//   try {
//     const data = req.user

//     // if (data.roles.includes('USER'))
//     //   return res.status(403).json('access denied')

//     if (req.user.roles.includes['USER'])
//       return res.status(400).send('access denied')

//     const User = await userServices.getUser()

//     console.log(User)
//     if (!User) res.status(400).send('User not found')

//     res.status(200).json({
//       sucess: 'OK',
//       message: 'User fetched',
//       data: User
//     })
//   } catch (e) {
//     res.status(400).json({
//       sucess: false,
//       message: e.message
//     })
//   }
// }
// exports.createMerchant = async (req, res) => {
//   try {
//     const data = {...req.body, roles: ['MERCHANT']}
//     const user = await userServices.createMerchant(data)

//     res.status(200).json({
//       sucess: 'Ok',
//       data: user,
//       message: 'User registered'
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(error.statusCode || 500).send(error.message)
//   }
// }

// exports.updateMerchant = async (req, res) => {
//   try {
//     const id = req.params.id

//     // Ensure you await the user update function if it's asynchronous
//     const user = await userServices.updateMerchant(id, req.body)

//     // Handle case where the user is not found or update failed
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Merchant not found or update failed'
//       })
//     }

//     // Return the success response
//     res.json({
//       message: 'Merchant updated successfully',
//       success: true,
//       data: user
//     })
//   } catch (e) {
//     console.error('Error updating merchant:', e) // Log the error for debugging

//     res.status(400).json({
//       success: false,
//       message: e.message || 'Something went wrong while updating the merchant'
//     })
//   }
// }

// exports.deleteUser = async (req, res) => {
//   try {
//     const id = req.params.id
//     const user = req.body

//     const userdata = await User.findById(id)

//     if (!userdata) return res.status(400).send('user not found')

//     const deletedUser = await userServices.deleteUser(id)

//     res.status(200).json({
//       sucess: 'OK',
//       message: 'user sucessfully deleted'
//     })
//   } catch (e) {
//     console.log(e.message)
//   }
// }

// exports.getUserById = async () => {
//   try {
//   } catch (e) {}
// }

const userServices = require('../services/userServices')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

function sendErrorResponse (res, { message, field }) {
  res.status(400).json({
    success: false,
    message,
    field
  })
}

exports.getUser = async (req, res) => {
  try {
    const data = req.user

    // Check for user role (ensure correct method call)
    if (!req.user.roles.includes('ADMIN'))
      return sendErrorResponse(res, {
        message: 'Access denied',
        field: 'roles'
      })

    // Fetch user details
    const user = await userServices.getUser()

    if (!user) {
      return sendErrorResponse(res, {
        message: 'User not found',
        field: 'user'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    })
  } catch (e) {
    sendErrorResponse(res, { message: e.message || 'Error fetching user' })
  }
}

exports.createMerchant = async (req, res) => {
  try {
    const data = { ...req.body, roles: ['MERCHANT'] }

    const file = req.file

    // console.log(data.password)
    if (!data.password) {
      throw new Error('Password is required to create a merchant.')
    }

    const hashedPassword = bcrypt.hashSync(data.password) // Ensure 'data.password' exists
    data.password = hashedPassword

    console.log(req.file)
    const user = await userServices.createMerchant(data, file)

    res.status(200).json({
      success: true,
      data: user,
      message: 'Merchant successfully registered'
    })
  } catch (error) {
    console.log(error)
    sendErrorResponse(res, {
      message: error.message || 'Error registering merchant',
      field: 'merchant'
    })
  }
}

exports.updateMerchant = async (req, res) => {
  try {
    const id = req.params.id

    // Ensure you await the user update function if it's asynchronous
    const user = await userServices.updateMerchant(id, req.body)

    // Handle case where the user is not found or update failed
    if (!user) {
      return sendErrorResponse(res, {
        message: 'Merchant not found or update failed',
        field: 'merchant'
      })
    }

    // Return the success response
    res.json({
      message: 'Merchant updated successfully',
      success: true,
      data: user
    })
  } catch (e) {
    console.error('Error updating merchant:', e)
    sendErrorResponse(res, {
      message: e.message || 'Error updating merchant',
      field: 'merchant'
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id

    // Ensure the user exists
    const userdata = await User.findById(id)
    if (!userdata)
      return sendErrorResponse(res, {
        message: 'User not found',
        field: 'user'
      })

    // Delete user
    await userServices.deleteUser(id)

    res.status(200).json({
      success: true,
      message: 'User successfully deleted'
    })
  } catch (e) {
    console.log(e.message)
    sendErrorResponse(res, {
      message: e.message || 'Error deleting user',
      field: 'user'
    })
  }
}

// Implementation for getUserById is missing - add it if needed
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userServices.getUserById(id)

    if (!user) {
      return sendErrorResponse(res, {
        message: 'User not found',
        field: 'user'
      })
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'User fetched successfully'
    })
  } catch (e) {
    console.log(e.message)
    sendErrorResponse(res, {
      message: 'Error fetching user by ID',
      field: 'user'
    })
  }
}
