const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - vendor id
 */
const updateProfileInDB = (req = {}, id = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true,
        select: '-role -_id -updatedAt -createdAt'
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

module.exports = { updateProfileInDB }
