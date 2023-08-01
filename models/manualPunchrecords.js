import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now()
const schema = new Schema(
  {
    type: {
      type: String,
      required: [true, '缺少類型'],
      enum: {
        values: ['中午未休', '一般加班', '國定假日加班', '休假日加班', '例假日加班']
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
    year: {
      type: String,
      default: today.year
      // required: [true, '請輸入年']
    },
    month: {
      type: String,
      default: today.month.toString().padStart(2, '0')
    },
    day: {
      type: String,
      default: today.day
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
      default: ''
    },
    overhourfirst: {
      type: String
    },
    overhoursecond: {
      type: String
    },
    overhourthree: {
      type: String
    },
    state: {
      type: String,
      default: '審核中',
      required: false,
      enum: {
        values: ['審核中', '已審核', '已退回']
      }
    },
    manager: {
      type: String,
      required: false
    },
    createtime: {
      type: String
    }
  },
  { versionKey: false }
)

export default model('manualPunchrecords', schema)
