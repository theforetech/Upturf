const { generateToken, generateRefreshToken } = require('./generateToken')

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (
  { _id = '', verification = '' },
  userInfo = {}
) => {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV !== 'production') {
      userInfo.verification = verification
    }
    userInfo.ability = [
      {
        action: 'manage',
        subject: 'all'
      }
    ]
    const data = {
      accessToken: generateToken(_id),
      refreshToken: generateRefreshToken(_id),
      userData: userInfo
    }
    resolve(data)
  })
}

module.exports = { returnRegisterToken }
