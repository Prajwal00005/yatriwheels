const roleBasedAuth = role => {
  return (req, res, next) => {
    console.log(role)
    const user = req.user
    console.log(user)
    // Make sure user exists and has roles
    if (!user || !user.roles) {
      return res.status(401).send('UnAuthorized')
    }

    // Check if user has the required role
    if (user.roles.includes(role)) {
      return next()
    }
    // Deny access if the role doesn't match
    res.status(404).send('Access Denied')
  }
}

module.exports = roleBasedAuth
