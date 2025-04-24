const express = require('express')
const auth = require('../middlewares/auth')
const roleBasedAuth = require('../middlewares/roleBasedAuth')
const {
  createVehicle,
  Vehicle,
  VehicleById,
  updateVehicle,
  deleteVehicle,
  getVehiclesByUser
} = require('../controllers/vehicleController')
const multer = require('multer')
const storage = require('../middlewares/multer')

const upload = multer({ storage: storage })
const router = express.Router()

router.post(
  '/create',
  auth,
  roleBasedAuth('ADMIN'),
  upload.single('image'),
  createVehicle
)
router.patch('/update/:id', auth, roleBasedAuth('MERCHANT'), updateVehicle)
router.get('/vehicles', auth, Vehicle)
router.get('/vehicle/:id', auth, VehicleById)
router.delete('/delete/:id', auth, roleBasedAuth('ADMIN'), deleteVehicle)
router.get('/Vehicle', auth, roleBasedAuth('MERCHANT'), getVehiclesByUser)

module.exports = router
