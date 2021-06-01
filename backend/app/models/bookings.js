const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const BookingSchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['success', 'failed', null],
      default: null
    },
    paymentSuccessResponse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    paymentType: {
      type: String,
      enum: ['single', 'split'],
      default: 'single'
    },
    contactName: {
      type: String
    },
    contactPhone: {
      type: String
    },
    bookingType: {
      type: String
    },
    splitPaymentSuccessResponses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  }
)
BookingSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Booking', BookingSchema)
