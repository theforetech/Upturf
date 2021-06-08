const express = require('express')
const router = express.Router()
require('../../config/vendorPassport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/authVendor')

const {
  getVendors,
  createVendor,
  getVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendors')

const {
  validateCreateVendor,
  validateGetVendor,
  validateUpdateVendor,
  validateDeleteVendor
} = require('../controllers/vendors/validators')

/*
 * Vendors routes
 */

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  getVendors
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  validateCreateVendor,
  createVendor
)

/*
 * Get item route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  validateGetVendor,
  getVendor
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  validateUpdateVendor,
  updateVendor
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['vendor']),
  trimRequest.all,
  validateDeleteVendor,
  deleteVendor
)

module.exports = router
