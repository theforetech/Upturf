const { matchedData } = require('express-validator')

const {
  findVendor,
  VendorIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveVendorAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const Vendor = await findVendor(data.email)
    await VendorIsBlocked(Vendor)
    await checkLoginAttemptsAndBlockExpires(Vendor)
    const isPasswordMatch = await checkPassword(data.password, Vendor)
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(Vendor))
    } else {
      // all ok, register access and return token
      Vendor.loginAttempts = 0
      await saveLoginAttemptsToDB(Vendor)
      res.status(200).json(await saveVendorAccessAndReturnToken(req, Vendor))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
