import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入姓名']
    },
    number: {
      type: String,
      required: [true, '請輸入員工編號']
    },
    place: {
      type: String,
      default: '總部'
    },
    year: {
      type: String
    },
    month: {
      type: String
    },
    day: {
      type: String
    },
    ClockIn: {
      type: String,
      default: ''
    },
    ClockOut: {
      type: String,
      default: ''
    },
    hours: {
      type: String,
      default: ''
    },
    team: {
      type: String,
      default: '早班',
      enum: {
        values: ['資訊', '早班', '晚班', '人事', 'PT']
      }
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
    updatedAt: today,
    updatedBy: user.name || 'admin' // you can change this to the actual user
  })
  next()
})
export default model('workSchedules', schema)
