const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TurfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    addressFull: {
      type: String,
      required: true
    },
    pinCode: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vendor'
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Sport'
    },
    images: {
      type: Array,
      default: []
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
TurfSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Turf', TurfSchema)
