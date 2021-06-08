const {
  getVendorIdFromToken,
  findVendorById,
  saveVendorAccessAndReturnToken
} = require('./helpers')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getRefreshToken = async (req, res) => {
  console.log('SADASDASD')
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let VendorId = await getVendorIdFromToken(tokenEncrypted)
    VendorId = await isIDGood(VendorId)
    const Vendor = await findVendorById(VendorId)
    const token = await saveVendorAccessAndReturnToken(req, Vendor)
    // Removes Vendor info from response
    delete token.Vendor
    res.status(200).json(token)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getRefreshToken }
