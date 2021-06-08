/**
 * Creates an object with vendor info
 * @param {Object} req - request object
 */
const setVendorInfo = (req = {}) => {
  return new Promise((resolve) => {
    let vendor = {
      _id: req._id,
      name: req.name,
      email: req.email,
      role: req.role,
      verified: req.verified,
      address: req.address,
      contactName: req.contactName,
      profileForm: req.profileForm,
      turfs: req.turfs === undefined ? req.turfs : req.turfs.length,
      phoneNumber: req.phoneNumber
    }
    // Adds verification for testing purposes
    if (process.env.NODE_ENV !== 'production') {
      vendor = {
        ...vendor,
        verification: req.verification
      }
    }
    resolve(vendor)
  })
}

module.exports = { setVendorInfo }
