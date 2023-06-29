import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    type: {
      type: String,
      required: [true, '缺少類型'],
      enum: {
        values: ['加班', '補打上班', '補打下班']
      }
    },
    name: {
      type: String,
      required: [true, '缺少姓名']
    },
    number: {
      type: String,
      required: [true, '缺少工號']
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    description: {
      type: String,
      required: false,
      default: ''
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
    hours: {
      type: String,
      default: 0
    },
    state: {
      type: String,
      default: '',
      required: false,
      enum: {
        values: ['審核中', '已審核', '已退回']
      }
    },
    manager: {
      type: String,
      required: false
    }
  },
  { versionKey: false }
)

export default model('manualPunchrecords', schema)
