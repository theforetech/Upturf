const { blockIsExpired } = require('./blockIsExpired')
const { buildErrObject } = require('../../../middleware/utils')

/**
 *
 * @param {Object} Vendor - Vendor object.
 */
const checkLoginAttemptsAndBlockExpires = (Vendor = {}) => {
  return new Promise((resolve, reject) => {
    // Let Vendor try to login again after blockexpires, resets Vendor loginAttempts
    if (blockIsExpired(Vendor)) {
      Vendor.loginAttempts = 0
      Vendor.save((err, result) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        if (result) {
          return resolve(true)
        }
      })
    }
    // Vendor is not blocked, check password (normal behaviour)
    resolve(true)
  })
}

module.exports = { checkLoginAttemptsAndBlockExpires }
