const User = require('../../models/user')
const Vendor = require('../../models/vendor')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = (email = '', type = '') => {
  if (type === 'user') {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email
        },
        (err, item) => {
          if (err) {
            return reject(buildErrObject(422, err.message))
          }

          if (item) {
            return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
          }
          resolve(false)
        }
      )
    })
  } else {
    return new Promise((resolve, reject) => {
      Vendor.findOne(
        {
          email
        },
        (err, item) => {
          if (err) {
            return reject(buildErrObject(422, err.message))
          }

          if (item) {
            return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
          }
          resolve(false)
        }
      )
    })
  }
}

module.exports = { emailExists }
