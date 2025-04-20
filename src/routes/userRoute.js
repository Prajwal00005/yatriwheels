const express = require('express')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')
const {
  createMerchant,
  updateMerchant,
  deleteUser,
  getUser
} = require('../controllers/userController')
const router = express.Router()

router.post('/merchant', auth, roleBasedAuth('ADMIN'), createMerchant)
router.patch(
  '/updateMerchant/:id',
  auth,
  roleBasedAuth('ADMIN'),
  updateMerchant
)
router.delete('/deleteUser/:id', auth, roleBasedAuth('ADMIN'), deleteUser)

router.get('/users', auth, roleBasedAuth('ADMIN'), getUser)

module.exports = router
