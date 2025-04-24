const User = require('../models/User')
const bcrypt = require('bcryptjs')

const registerServices = async (data, file) => {
  try {
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

    // store the password

    const response = await User.create({
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: hashedpassword,
      roles: data.roles,
      avatar: data.file.path
    })
    console.log(response)
    return response
  } catch (e) {
    // res.send(e.message)
    throw {
      statusCode: 400,
      message: e.message
    }
  }
}

const loginServices = async data => {
  try {
    // Find the user by email or phone
    // console.log(data)
    const user = await User.findOne({
      $or: [{ email: data.email }, { phone: data.phone }]
    })
    console.log(user)
    // If user is not found, send specific message
    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found with provided email or phone'
      }
    }

    // Compare the password with the stored hashed password
    const isPasswordMatched = await bcrypt.compare(data.password, user.password)

    console.log(user.password)
    console.log(data.password)

    // If password doesn't match, send specific message
    if (!isPasswordMatched) {
      throw {
        statusCode: 401,
        message: 'Invalid credentials: Password does not match'
      }
    }

    // If user exists and password matches, return user details
    return user
  } catch (e) {
    // Throw error with specific message and status code
    throw {
      statusCode: e.statusCode || 500,
      message: e.message
    }
  }
}

module.exports = { loginServices, registerServices }
