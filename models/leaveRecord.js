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
    year: {
      type: String,
      default: today.year
      // required: [true, '請輸入年']
    },
    month: {
      type: String,
      default: today.month
      // required: [true, '請輸入月']
    },
    day: {
      type: String,
      default: today.day
      // required: [true, '請輸入日']
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
      default: 0
    },
    punchtype: { type: String, default: '未填寫', required: [true, '請輸入假別'] },
    state: {
      type: String,
      default: '已審核',
      enum: {
        values: ['審核中', '已審核', '已退回']
      }
    },
    team: {
      type: String,
      default: '早班',
      enum: {
        values: ['早班', '晚班', '人事', 'PT', '外籍', '責任制']
      }
    },
    updates: [
      {
        updatedAt: String,
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
export default model('leaveRecord', schema)
