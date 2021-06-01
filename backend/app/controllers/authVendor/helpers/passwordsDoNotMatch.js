const { saveLoginAttemptsToDB } = require('./saveLoginAttemptsToDB')
const { blockVendor } = require('./blockVendor')
const { buildErrObject } = require('../../../middleware/utils')
const LOGIN_ATTEMPTS = 5

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockVendor function
 * @param {Object} vendor - vendor object
 */
const passwordsDoNotMatch = async (vendor = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      vendor.loginAttempts += 1
      await saveLoginAttemptsToDB(vendor)
      if (vendor.loginAttempts <= LOGIN_ATTEMPTS) {
        return reject(buildErrObject(409, 'WRONG_PASSWORD'))
      }

      resolve(await blockVendor(vendor))
    } catch (error) {
      throw error
    }
  })
}

module.exports = { passwordsDoNotMatch }
