const express = require('express')
const {
  register,
  login,
  logout,
  checkToken
} = require('../controllers/authController')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/check-token', auth, checkToken)

module.exports = router
