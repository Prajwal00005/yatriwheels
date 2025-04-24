// const { EMAIL_REGEX, PASSWORD_REGEX } = require('../constants/Regex');
// const { formattedData } = require('../helpers/formattedData');
// const authServices = require('../services/authServices');
// const { createJwt } = require('../utils/JWT');

// // Helper function to send a standardized bad request response
// function sendBadRequest(res, { message, field }) {
//   res.status(422).json({
//     message,
//     field,
//   });
// }

// const register = async (req, res) => {
//   try {
//     const { name, address, phone, email, password, confirmPassword, roles } = req.body;
//     console.log(req.body);

//     // Validation checks
//     if (!name) return sendBadRequest(res, { field: "name", message: "Name is required" });
//     if (!address) return sendBadRequest(res, { field: "address", message: "Address is required" });
//     if (!phone) return sendBadRequest(res, { field: "phone", message: "Phone is required" });
//     if (!email) return sendBadRequest(res, { field: "email", message: "Email is required" });
//     if (!EMAIL_REGEX.test(email)) return sendBadRequest(res, { field: "email", message: "Email must be valid" });
//     if (!password) return sendBadRequest(res, { field: "password", message: "Password is required" });
//     if (!confirmPassword) return sendBadRequest(res, { field: "confirmPassword", message: "Confirm password is required" });
//     if (password !== confirmPassword) return sendBadRequest(res, { field: "confirmPassword", message: "Confirm password must match with password" });
//     if (!PASSWORD_REGEX.test(password)) return sendBadRequest(res, { field: "password", message: "Password must be valid" });

//     // Call service to store the user in the DB
//     const user = await authServices.registerServices({ ...req.body, roles: ["USER"] });

//     // Format user data
//     const formattedUser = formattedData(user);

//     // Generate JWT token
//     const token = createJwt(formattedUser);

//     // Send token as a cookie
//     res.cookie('authtoken', token);

//     // Send success response
//     res.status(200).json({
//       success: 'OK',
//       token,
//       data: formattedUser,
//       message: "Successfully registered",
//     });
//   } catch (e) {
//     // Catch and return any error during registration
//     res.status(400).json({
//       success: false,
//       message: e.message,
//     });
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, phone, password } = req.body;

//     // Check if required fields are provided
//     if (!email && !phone) {
//       return res.status(400).json({
//         message: 'Please provide either email or phone',
//         success: false,
//       });
//     }
//     if (!password) {
//       return res.status(400).json({
//         message: 'Please provide a password',
//         success: false,
//       });
//     }

//     // Call the login service to verify credentials
//     const user = await authServices.loginServices(req.body);

//     if (!user) {
//       return res.status(401).json({
//         message: 'Invalid credentials: User not found',
//         success: false,
//       });
//     }

//     // Format user data
//     const formattedUser = formattedData(user);

//     // Generate JWT token
//     const token = createJwt(formattedUser);

//     // Send the token in a secure cookie
//     res.cookie('authtoken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only in production
//       maxAge: 3600000, // 1 hour expiration
//     });

//     // Send success response
//     res.status(200).json({
//       message: 'Login successful',
//       data: formattedUser,
//       token,
//       success: true,
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// const logout = (req, res) => {
//   // Clear the cookie to log the user out
//   res.clearCookie('authtoken', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Only for secure connections (HTTPS)
//   });

//   // Send success response
//   res.status(200).json({
//     message: 'Logged out successfully',
//     success: true,
//   });
// };

// const checkToken = (req, res) => {
//   return res.json(req.user);
// };

// module.exports = { register, login, logout, checkToken };

const { EMAIL_REGEX, PASSWORD_REGEX } = require('../constants/Regex')
const { formattedData } = require('../helpers/formattedData')
const authServices = require('../services/authServices')
const { createJwt } = require('../utils/JWT')

// Helper function to send a standardized bad request response

const register = async (req, res) => {
  try {
    const { name, address, phone, email, password, confirmPassword, roles } =
      req.body

    const file = req.file
    // console.log(file)

    // Validation checks
    if (!name)
      return sendBadRequest(res, { field: 'name', message: 'Name is required' })
    if (!address)
      return sendBadRequest(res, {
        field: 'address',
        message: 'Address is required'
      })
    if (!phone)
      return sendBadRequest(res, {
        field: 'phone',
        message: 'Phone is required'
      })
    if (!email)
      return sendBadRequest(res, {
        field: 'email',
        message: 'Email is required'
      })
    if (!EMAIL_REGEX.test(email))
      return sendBadRequest(res, {
        field: 'email',
        message: 'Email must be valid'
      })
    if (!password)
      return sendBadRequest(res, {
        field: 'password',
        message: 'Password is required'
      })
    if (!confirmPassword)
      return sendBadRequest(res, {
        field: 'confirmPassword',
        message: 'Confirm password is required'
      })
    if (password !== confirmPassword)
      return sendBadRequest(res, {
        field: 'confirmPassword',
        message: 'Confirm password must match with password'
      })
    if (!PASSWORD_REGEX.test(password))
      return sendBadRequest(res, {
        field: 'password',
        message: 'Password must be valid'
      })

    // Call service to store the user in the DB
    // console.log(file)
    const user = await authServices.registerServices({
      ...req.body,
      roles: ['USER'],
      file
    })

    // Format user data
    const formattedUser = formattedData(user)

    // Generate JWT token
    const token = createJwt(formattedUser)

    // Send token as a cookie
    res.cookie('authtoken', token)

    // Send success response
    res.status(200).json({
      success: 'OK',
      token,
      data: formattedUser,
      message: 'Successfully registered'
    })
  } catch (e) {
    // Catch and return any error during registration
    res.status(400).json({
      success: false,
      message: e.message
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body

    // console.log(object)

    // Check if required fields are provided
    if (!email && !phone) {
      return res.status(400).json({
        message: 'Please provide either email or phone',
        success: false
      })
    }
    if (!password) {
      return res.status(400).json({
        message: 'Please provide a password',
        success: false
      })
    }

    // Call the login service to verify credentials
    const user = await authServices.loginServices(req.body)

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials: User not found',
        success: false
      })
    }

    // Format user data
    const formattedUser = formattedData(user)

    // Generate JWT token
    const token = createJwt(formattedUser)

    // Send the token in a secure cookie
    res.cookie('authtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only in production
      maxAge: 3600000 // 1 hour expiration
    })

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      data: formattedUser,
      token,
      success: true
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    })
  }
}

const logout = (req, res) => {
  // Clear the cookie to log the user out
  res.clearCookie('authtoken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Only for secure connections (HTTPS)
  })

  // Send success response
  res.status(200).json({
    message: 'Logged out successfully',
    success: true
  })
}

const checkToken = (req, res) => {
  return res.json(req.user)
}

module.exports = { register, login, logout, checkToken }
