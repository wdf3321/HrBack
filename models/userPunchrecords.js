import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    name: {
      type: String
      // required: [true, '請輸入姓名']
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
    onClockIn: {
      type: String,
      default: ''
    },
    onClockOut: {
      type: String,
      default: ''
    },
    editClockIn: {
      type: String,
      default: ''
    },
    editClockOut: {
      type: String,
      default: ''
    },
    hours: {
      type: String,
      default: 0
    },
    holiday: {
      type: Boolean,
      default: false
    },
    break: { type: Boolean, default: false },
    overhourfirst: { type: String, default: '' },
    overhoursecond: { type: String, default: '' },
    overhourthird: { type: String, default: '' },
    late: { type: String, default: false },
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
        values: ['資訊', '早班', '晚班', '人事', 'PT', '外籍']
      }
    },
    updates: [
      {
        updatedAt: Date,
        updatedBy: String
      }
    ],
    remark: { type: String, default: '' }
  },
  { versionKey: false }
)
schema.pre('save', function (next) {
  const user = this
  user.updates.push({
    updatedAt: new Date(),
    updatedBy: 'admin' // you can change this to the actual user
  })
  next()
})
export default model('userPunchrecords', schema)
