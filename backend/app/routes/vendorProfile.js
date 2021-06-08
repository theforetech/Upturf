const express = require('express')
const router = express.Router()
require('../../config/vendorPassport')
const passport = require('passport')
const requireAuth = passport.authenticate('vendor', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/authVendor')

const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/vendorProfile')

const {
  validateUpdateProfile,
  validateChangePassword
} = require('../controllers/vendorProfile/validators')

/*
 * Profile routes
 */

/*
 * Get profile route
 */
router.get(
  '/vendor',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  getProfile
)

/*
 * Update profile route
 */
router.patch(
  '/vendor',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateProfile,
  updateProfile
)

/*
 * Change password route
 */
router.post(
  '/vendor/changePassword',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateChangePassword,
  changePassword
)

module.exports = router
