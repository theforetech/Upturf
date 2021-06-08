const { buildErrObject } = require('../../../middleware/utils')

/**
 * Verifies an vendor
 * @param {Object} vendor - vendor object
 */
const verifyVendor = (vendor = {}) => {
  return new Promise((resolve, reject) => {
    vendor.verified = true
    vendor.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        verified: item.verified
      })
    })
  })
}

module.exports = { verifyVendor }
