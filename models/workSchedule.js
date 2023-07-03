import { Schema, model } from 'mongoose'

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
    overtimehours: {
      type: String,
      default: ''
    },
    team: {
      type: String,
      default: '早班',
      enum: {
        values: ['資訊', '早班', '晚班']
      }
    }
  },
  { versionKey: false }
)

export default model('workSchedule', schema)