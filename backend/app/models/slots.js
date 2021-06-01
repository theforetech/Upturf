const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const SlotSchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
SlotSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Slot', SlotSchema)
