const uuid = require('uuid')
const Vendor = require('../../../models/vendor')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Registers a new vendor in database
 * @param {Object} req - request object
 */
const registerVendor = (req = {}) => {
  return new Promise((resolve, reject) => {
    const vendor = new Vendor({
      name: req.name,
      email: req.email,
      address: req.address,
      contactName: req.contactName,
      phoneNumber: req.phoneNumber,
      password: req.password,
      role: req.role,
      verification: uuid.v4()
    })
    vendor.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

module.exports = { registerVendor }
