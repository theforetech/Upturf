const { blockIsExpired } = require('./blockIsExpired')
const { blockVendor } = require('./blockVendor')
const {
  checkLoginAttemptsAndBlockExpires
} = require('./checkLoginAttemptsAndBlockExpires')
const { checkPermissions } = require('./checkPermissions')
const { findForgotPassword } = require('./findForgotPassword')
const { findVendor } = require('./findVendor')
const { findVendorById } = require('./findVendorById')
const { findVendorToResetPassword } = require('./findVendorToResetPassword')
const { forgotPasswordResponse } = require('./forgotPasswordResponse')
const { generateToken } = require('./generateToken')
const { getVendorIdFromToken } = require('./getVendorIdFromToken')
const { markResetPasswordAsUsed } = require('./markResetPasswordAsUsed')
const { passwordsDoNotMatch } = require('./passwordsDoNotMatch')
const { registerVendor } = require('./registerVendor')
const { returnRegisterToken } = require('./returnRegisterToken')
const { saveForgotPassword } = require('./saveForgotPassword')
const { saveLoginAttemptsToDB } = require('./saveLoginAttemptsToDB')
const {
  saveVendorAccessAndReturnToken
} = require('./saveVendorAccessAndReturnToken')
const { setVendorInfo } = require('./setVendorInfo')
const { updatePassword } = require('./updatePassword')
const { vendorIsBlocked } = require('./vendorIsBlocked')
const { verificationExists } = require('./verificationExists')
const { verifyVendor } = require('./verifyVendor')

module.exports = {
  blockIsExpired,
  blockVendor,
  checkLoginAttemptsAndBlockExpires,
  checkPermissions,
  findForgotPassword,
  findVendor,
  findVendorById,
  findVendorToResetPassword,
  forgotPasswordResponse,
  generateToken,
  getVendorIdFromToken,
  markResetPasswordAsUsed,
  passwordsDoNotMatch,
  registerVendor,
  returnRegisterToken,
  saveForgotPassword,
  saveLoginAttemptsToDB,
  saveVendorAccessAndReturnToken,
  setVendorInfo,
  updatePassword,
  vendorIsBlocked,
  verificationExists,
  verifyVendor
}
