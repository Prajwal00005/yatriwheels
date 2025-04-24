const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.createMerchant = async (data, file) => {
  // console.log(data)
  // find existing user
  const existing_user = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }]
  })

  if (existing_user) {
    throw new Error('User already registered')
  }
  //hashed the password to store
  const hashedpassword = bcrypt.hashSync(data.password)

  if (data.roles.includes[('USER', 'MERCHANT')])
    return res.status(400).send('access denied')

  return await User.create({
    ...data,
    password: hashedpassword,
    roles: ['MERCHANT'],
    avatar: file.path
  })
}

exports.updateMerchant = async (id, data) => {
  try {
    // Find the existing user
    const user = await User.findById(id) // Ensure this is awaited

    if (!user) {
      throw new Error('User not found')
    }

    // Prepare the update data object, only including fields that are provided
    let updateData = {}

    // Only update the fields if they are provided in the request
    if (data.address) updateData.address = data.address
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone

    // If password is provided, hash it before saving
    if (data.password) {
      const hashedPassword = bcrypt.hashSync(data.password, 10) // Salt rounds = 10
      updateData.password = hashedPassword // Only include the password if it's provided
    }

    // Update the user with the new data (using the updateData object)
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true
    })

    if (!updatedUser) {
      throw new Error('User update failed')
    }

    return updatedUser // Return the updated user to be handled in the controller
  } catch (error) {
    // Log and throw the error to be handled by the controller
    console.error('Error updating merchant:', error)
    throw new Error(
      error.message || 'Something went wrong while updating the merchant'
    )
  }
}

exports.deleteUser = async id => {
  try {
    return await User.findByIdAndDelete(id)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

exports.getUser = async () => {
  return await User.find()
}
