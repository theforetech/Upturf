const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PaymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
PaymentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Payment', PaymentSchema)
