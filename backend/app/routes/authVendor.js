const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
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
router.post('/vendor/register', trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/vendor/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post(
  '/vendor/forgot',
  trimRequest.all,
  validateForgotPassword,
  forgotPassword
)

/*
 * Reset password route
 */
router.post(
  '/vendor/reset',
  trimRequest.all,
  validateResetPassword,
  resetPassword
)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin', 'vendor']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/vendor/login', trimRequest.all, validateLogin, login)

module.exports = router
