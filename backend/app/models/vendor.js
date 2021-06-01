const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    verification: {
      type: String
    },
    profileForm: {
      type: Boolean,
      default: false
    },
    contactName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    paymentDetails: {
      razorpayID: String
    },
    turfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf'
      }
    ],
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (vendor, salt, next) => {
  bcrypt.hash(vendor.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    vendor.password = newHash
    return next()
  })
}

const genSalt = (vendor, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(vendor, salt, next)
  })
}

VendorSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

VendorSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
VendorSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Vendor', VendorSchema)
