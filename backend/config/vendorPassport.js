const passport = require('passport')
const Vendor = require('../app/models/vendor')
const auth = require('../app/middleware/authVendor')
const JwtStrategyVendor = require('passport-jwt').Strategy

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim()
  } else if (req.body.token) {
    token = req.body.token.trim()
  } else if (req.query.token) {
    token = req.query.token.trim()
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token)
  }
  return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptionsVendor = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET_VENDOR
}

/**
 * Login with JWT middleware
 */
const jwtLoginVendor = new JwtStrategyVendor(
  jwtOptionsVendor,
  (payload, done) => {
    Vendor.findById(payload.data._id, (err, vendor) => {
      if (err) {
        return done(err, false)
      }
      return !vendor ? done(null, false) : done(null, vendor)
    })
  }
)

passport.use('vendor', jwtLoginVendor)
