const mongoose = require('mongoose')
const { EMAIL_REGEX } = require('../constants/Regex')
const { ROLE_ADMIN, ROLE_MERCHANT, ROLE_USER } = require('../constants/role')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'username is required']
    },
    address: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, 'must not less than 10 number'],
      maxLegth: [15, 'maximum length is 15']
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return EMAIL_REGEX.test(val)
        },
        message: 'Email must be in valid format'
      }
    },
    password: {
      type: String,
      required: true,
      minLength: [6, 'min length must be 6']
    },
    roles: {
      type: [String],
      default: [ROLE_USER],
      enum: [ROLE_ADMIN, , ROLE_MERCHANT, ROLE_USER]
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)

module.exports = User
