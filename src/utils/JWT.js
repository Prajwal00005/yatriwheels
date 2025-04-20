const JWT = require('jsonwebtoken')

const createJwt = data => {
  try {
    const token = JWT.sign(data, process.env.SECRET_KEY, { expiresIn: '5h' }) // Token expires in 1 hour
    return token
  } catch (error) {
    console.error('Error creating JWT:', error)
    throw new Error('Failed to create JWT token')
  }
}

const JWTVerify = async authtoken => {
  try {
    const data = await new Promise((resolve, reject) => {
      JWT.verify(authtoken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded)
      })
    })
    return data
  } catch (error) {
    throw new Error('Invalid token or token expired')
  }
}

module.exports = { createJwt, JWTVerify }
