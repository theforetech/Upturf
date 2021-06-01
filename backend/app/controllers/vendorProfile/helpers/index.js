const { changePasswordInDB } = require('./changePasswordInDB')
const { findVendor } = require('./findVendor')
const { getProfileFromDB } = require('./getProfileFromDB')
const { updateProfileInDB } = require('./updateProfileInDB')

module.exports = {
  changePasswordInDB,
  findVendor,
  getProfileFromDB,
  updateProfileInDB
}
