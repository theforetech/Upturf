const Vendor = require('../../../models/vendor')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Gets profile from database by id
 * @param {string} id - vendor id
 */
const getProfileFromDB = (id = '') => {
  return new Promise((resolve, reject) => {
    Vendor.findById(id, '-_id -updatedAt -createdAt', async (err, vendor) => {
      try {
        await itemNotFound(err, vendor, 'NOT_FOUND')
        resolve(vendor)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getProfileFromDB }
