const express = require('express')
const router = express.Router()
require('../../config/vendorPassport')
const passport = require('passport')
const requireAuth = passport.authenticate('vendor', {
  session: false
})
const trimRequest = require('trim-request')

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  roleAuthorization
} = require('../controllers/authVendor')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin
} = require('../controllers/authVendor/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['admin', 'vendor']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

module.exports = router
