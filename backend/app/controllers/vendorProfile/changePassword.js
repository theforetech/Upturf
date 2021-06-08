const {
  isIDGood,
  handleError,
  buildErrObject
} = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { checkPassword } = require('../../middleware/auth')
const { findVendor, changePasswordInDB } = require('./helpers')

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {
  try {
    const id = await isIDGood(req.vendor._id)
    const vendor = await findVendor(id)
    req = matchedData(req)
    const isPasswordMatch = await checkPassword(req.oldPassword, vendor)
    if (!isPasswordMatch) {
      return handleError(res, buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { changePassword }
