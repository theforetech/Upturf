const { buildErrObject } = require('../../../middleware/utils')

/**
 * Saves login attempts to dabatabse
 * @param {Object} vendor - vendor object
 */
const saveLoginAttemptsToDB = (vendor = {}) => {
  return new Promise((resolve, reject) => {
    vendor.save((err, result) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

module.exports = { saveLoginAttemptsToDB }
