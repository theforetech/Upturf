const { validateCreateVendor } = require('./validateCreateVendor')
const { validateDeleteVendor } = require('./validateDeleteVendor')
const { validateGetVendor } = require('./validateGetVendor')
const { validateUpdateVendor } = require('./validateUpdateVendor')

module.exports = {
  validateCreateVendor,
  validateDeleteVendor,
  validateGetVendor,
  validateUpdateVendor
}
