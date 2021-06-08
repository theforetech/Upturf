const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Checks if verification id exists for vendor
 * @param {string} id - verification id
 */
const verificationExists = (id = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findOne(
      {
        verification: id,
        verified: false
      },
      async (err, vendor) => {
        try {
          await itemNotFound(err, vendor, 'NOT_FOUND_OR_ALREADY_VERIFIED')
          resolve(vendor)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { verificationExists }
