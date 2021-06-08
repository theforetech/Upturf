const { generateToken, generateRefreshToken } = require('./generateToken')

/**
 * Builds the registration token
 * @param {Object} item - vendor object that contains created id
 * @param {Object} vendorInfo - vendor object
 */
const returnRegisterToken = (
  { _id = '', verification = '' },
  vendorInfo = {}
) => {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV !== 'production') {
      vendorInfo.verification = verification
    }
    vendorInfo.ability = [
      {
        action: 'manage',
        subject: 'all'
      }
    ]
    const data = {
      accessToken: generateToken(_id),
      refreshToken: generateRefreshToken(_id),
      vendorData: vendorInfo
    }
    resolve(data)
  })
}

module.exports = { returnRegisterToken }
