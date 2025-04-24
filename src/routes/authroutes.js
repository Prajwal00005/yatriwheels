const express = require('express')
const multer = require('multer')
const storage = require('../middlewares/multer')

const upload = multer({ storage: storage })
const {
  register,
  login,
  logout,
  checkToken
} = require('../controllers/authController')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')
const router = express.Router()

router.post('/register', upload.single('image'), register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/check-token', auth, checkToken)

module.exports = router
