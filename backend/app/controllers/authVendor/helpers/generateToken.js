const jwt = require('jsonwebtoken')
const { encrypt } = require('../../../middleware/authVendor')

/**
 * Generates a token
 * @param {Object} vendor - vendor object
 */
const generateToken = (vendor = '') => {
  try {
    // Gets expiration time
    const expiration =
      Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

    // returns signed and encrypted token
    return encrypt(
      jwt.sign(
        {
          data: {
            _id: vendor
          },
          exp: expiration
        },
        process.env.JWT_SECRET_VENDOR
      )
    )
  } catch (error) {
    throw error
  }
}

/**
 * Generates a refresh token
 * @param {Object} vendor - vendor object
 */
const generateRefreshToken = (vendor = '') => {
  try {
    // Gets expiration time
    const expiration = Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 2

    // returns signed and encrypted token
    return encrypt(
      jwt.sign(
        {
          data: {
            _id: vendor
          },
          exp: expiration
        },
        process.env.JWT_SECRET_VENDOR
      )
    )
  } catch (error) {
    throw error
  }
}

module.exports = { generateToken, generateRefreshToken }
