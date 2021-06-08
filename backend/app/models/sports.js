const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const SportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    // base64 encoded image
    image: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
SportSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Sport', SportSchema)
