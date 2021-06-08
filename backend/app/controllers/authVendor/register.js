const { matchedData } = require('express-validator')

const {
  registerVendor,
  setVendorInfo,
  returnRegisterToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailExists(req.email, 'vendor')
    console.log(req)
    if (!doesEmailExists) {
      // if (!req.role) {
      //   req.role = 'Vendor'
      //   console.log(req)
      // } else {
      //   console.log(req.role)
      //   if (req.role === 'admin') {
      //     req.role = 'admin'
      //   }
      // }
      const item = await registerVendor(req)
      const VendorInfo = await setVendorInfo(item)
      const response = await returnRegisterToken(item, VendorInfo)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json(response)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
