const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates a vendor password in database
 * @param {string} password - new password
 * @param {Object} vendor - vendor object
 */
const updatePassword = (password = '', vendor = {}) => {
  return new Promise((resolve, reject) => {
    vendor.password = password
    vendor.save(async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { updatePassword }
