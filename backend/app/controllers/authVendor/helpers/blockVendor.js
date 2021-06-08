const { addHours } = require('date-fns')
const HOURS_TO_BLOCK = 2

const { buildErrObject } = require('../../../middleware/utils')

/**
 * Blocks a Vendor by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} Vendor - Vendor object
 */
const blockVendor = (Vendor = {}) => {
  return new Promise((resolve, reject) => {
    Vendor.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    Vendor.save((err, result) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      if (result) {
        return resolve(buildErrObject(409, 'BLOCKED_Vendor'))
      }
    })
  })
}

module.exports = { blockVendor }
