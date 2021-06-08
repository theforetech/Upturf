const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds vendor by id
 * @param {string} id - vendor id
 */
const findVendor = (id = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findById(id, 'password email', async (err, vendor) => {
      try {
        await itemNotFound(err, vendor, 'USER_DOES_NOT_EXIST')
        resolve(vendor)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { findVendor }
