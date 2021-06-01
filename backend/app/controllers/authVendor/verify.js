const { matchedData } = require('express-validator')
const { verificationExists, verifyVendor } = require('./helpers')

const { handleError } = require('../../middleware/utils')

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verify = async (req, res) => {
  try {
    req = matchedData(req)
    const Vendor = await verificationExists(req.id)
    res.status(200).json(await verifyVendor(Vendor))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { verify }
