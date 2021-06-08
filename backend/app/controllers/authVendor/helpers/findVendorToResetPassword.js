const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds Vendor by email to reset password
 * @param {string} email - Vendor email
 */
const findVendorToResetPassword = (email = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findOne(
      {
        email
      },
      async (err, vendor) => {
        try {
          await itemNotFound(err, vendor, 'NOT_FOUND')
          resolve(vendor)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findVendorToResetPassword }
