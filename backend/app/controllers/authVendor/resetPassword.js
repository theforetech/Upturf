const { matchedData } = require('express-validator')
const {
  findForgotPassword,
  findVendorToResetPassword,
  updatePassword,
  markResetPasswordAsUsed
} = require('./helpers')
const { handleError } = require('../../middleware/utils')

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const resetPassword = async (req, res) => {
  try {
    const data = matchedData(req)
    const forgotPassword = await findForgotPassword(data.id)
    const Vendor = await findVendorToResetPassword(forgotPassword.email)
    await updatePassword(data.password, Vendor)
    const result = await markResetPasswordAsUsed(req, forgotPassword)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { resetPassword }
