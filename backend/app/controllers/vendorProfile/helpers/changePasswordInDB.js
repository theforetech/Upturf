const Vendor = require('../../../models/vendor')
const {
  itemNotFound,
  buildErrObject,
  buildSuccObject
} = require('../../../middleware/utils')

/**
 * Changes password in database
 * @param {string} id - vendor id
 * @param {Object} req - request object
 */
const changePasswordInDB = (id = '', req = {}) => {
  return new Promise((resolve, reject) => {
    Vendor.findById(id, '+password', async (err, vendor) => {
      try {
        await itemNotFound(err, vendor, 'NOT_FOUND')

        // Assigns new password to vendor
        vendor.password = req.newPassword

        // Saves in DB
        vendor.save((error) => {
          if (err) {
            return reject(buildErrObject(422, error.message))
          }
          resolve(buildSuccObject('PASSWORD_CHANGED'))
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { changePasswordInDB }
