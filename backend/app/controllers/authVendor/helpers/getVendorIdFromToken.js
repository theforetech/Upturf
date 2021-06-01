const jwt = require('jsonwebtoken')
const { buildErrObject } = require('../../../middleware/utils')
const { decrypt } = require('../../../middleware/auth')

/**
 * Gets vendor id from token
 * @param {string} token - Encrypted and encoded token
 */
const getVendorIdFromToken = (token = '') => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

module.exports = { getVendorIdFromToken }
