import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入姓名']
    },
    date: {
      type: String,
      required: [true, '請輸入日期']
    },
    onClockIn: {
      type: String,
      default: ''
    },
    onClockOut: {
      type: String,
      default: ''
    },
    hours: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false }
)

export default model('userPunchrecords', schema)
