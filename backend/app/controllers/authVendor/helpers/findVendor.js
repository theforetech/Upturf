const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds Vendor by email
 * @param {string} email - Vendor´s email
 */
const findVendor = (email = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification',
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'Vendor_DOES_NOT_EXIST')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findVendor }
