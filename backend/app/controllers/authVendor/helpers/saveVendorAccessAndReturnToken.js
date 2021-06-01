const VendorAccess = require('../../../models/vendorAccess')
const { setVendorInfo } = require('./setVendorInfo')
const { generateToken, generateRefreshToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new vendor access and then returns token
 * @param {Object} req - request object
 * @param {Object} vendor - vendor object
 */
const saveVendorAccessAndReturnToken = (req = {}, vendor = {}) => {
  return new Promise((resolve, reject) => {
    const vendorAccess = new VendorAccess({
      email: vendor.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    vendorAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const vendorInfo = await setVendorInfo(vendor)
        // Returns data with access token
        resolve({
          accessToken: generateToken(vendor._id),
          refreshToken: generateRefreshToken(vendor._id),
          vendorData: {
            ...vendorInfo,
            ability:
              vendorInfo.role === 'admin'
                ? [
                    {
                      action: 'manage',
                      subject: 'all'
                    }
                  ]
                : [
                    {
                      action: 'read',
                      subject: 'ACL'
                    },
                    {
                      action: 'read',
                      subject: 'Auth'
                    }
                  ]
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveVendorAccessAndReturnToken }
