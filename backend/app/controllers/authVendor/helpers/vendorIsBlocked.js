const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if blockExpires from vendor is greater than now
 * @param {Object} vendor - vendor object
 */
const vendorIsBlocked = (vendor = {}) => {
  return new Promise((resolve, reject) => {
    if (vendor.blockExpires > new Date()) {
      return reject(buildErrObject(409, 'BLOCKED_USER'))
    }
    resolve(true)
  })
}

module.exports = { vendorIsBlocked }
