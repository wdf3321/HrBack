import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    date: {
      type: String,
      default: today,
      required: [true, '請輸入日期']
    },
    year: { type: String },
    month: { type: String },
    needworker: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    },
    cowork: {
      type: Number,
      default: 0
    },
    added: { type: Boolean },
    updates: [
      {
        updatedAt: Date,
        updatedBy: String
      }
    ]
  },
  { versionKey: false }
)

schema.pre('save', function (next) {
  const user = this
  user.updates.push({
    updatedAt: new Date(),
    updatedBy: user.name || 'admin' // you can change this to the actual user
  })
  next()
})
export default model('workerIndeed', schema)
