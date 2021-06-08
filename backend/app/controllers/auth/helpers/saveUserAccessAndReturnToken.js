const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateToken, generateRefreshToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = (req = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    userAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const userInfo = await setUserInfo(user)
        // Returns data with access token
        resolve({
          accessToken: generateToken(user._id),
          refreshToken: generateRefreshToken(user._id),
          userData: {
            ...userInfo,
            ability:
              userInfo.role === 'admin'
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

module.exports = { saveUserAccessAndReturnToken }
