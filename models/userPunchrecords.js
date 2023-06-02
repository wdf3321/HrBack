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
    },
    state: {
      type: String,
      default: '審核中',
      enum: {
        values: ['審核中', '已審核', '已退回']
      }
    }
  },
  { versionKey: false }
)

export default model('userPunchrecords', schema)
