const express = require('express')
require('dotenv').config()
require('./config/database')()
const authroute = require('./routes/authroutes')
const vehicleRoutes = require('./routes/vehicleRoute')
const userRoutes = require('./routes/userRoute')
const bookRoute = require('./routes/bookroutes')
const paymentRoute = require('./routes/paymentroutes')
const path = require('path')
const app = express()
var cors = require('cors')
// const handleError = require("./controllers/handleErrorController");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(cors())

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.status(200).json({
    port: PORT,
    message: 'sucessfully running',
    version: '1.0.0'
  })
})

app.use('/api/v1/auth', authroute)
app.use('/api/v1/', vehicleRoutes)
app.use('/api/v1/', userRoutes)
app.use('/api/v1/', bookRoute)
app.use('/api/v1/', paymentRoute)

// app.use(handleError)

app.listen(PORT, () => {
  console.log(`server started sucessfully at PORT ${PORT}`)
})
