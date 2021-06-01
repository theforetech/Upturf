const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds Vendor by ID
 * @param {string} VendorId - Vendor´s id
 */
const findVendorById = (VendorId = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findById(VendorId, async (err, item) => {
      try {
        await itemNotFound(err, item, 'Vendor_DOES_NOT_EXIST')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { findVendorById }
