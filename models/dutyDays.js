import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    year: {
      type: String,
      default: today.year
      // required: [true, '請輸入年']
    },
    month: {
      type: String,
      default: today.month,
      required: [true, '請輸入月']
    },
    day: {
      type: Number,
      default: ''
    },
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
export default model('dutyDays', schema)
