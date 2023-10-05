import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

const today = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
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
    editClockInStatus: { type: Boolean, default: false },
    editClockOut: {
      type: String,
      default: ''
    },
    editClockOutStatus: { type: Boolean, default: false },
    hours: {
      type: String,
      default: 0
    },
    holiday: {
      type: Boolean,
      default: false
    },
    break: { type: Boolean, default: false },
    overhourfirst: { type: String, default: 0 },
    overhoursecond: { type: String, default: 0 },
    overhourthird: { type: String, default: 0 },
    late: { type: Number, default: 0 },
    lateEdit: { type: Boolean, default: false },
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
  console.log('user', user)
  user.updates.push({
    updatedAt: today,
    updatedBy: '補打卡' // you can change this to the actual user
  })
  next()
})

// schema.pre('findOneAndUpdate', function (next) {
//   const updateData = this.getUpdate()
//   console.log('updateData', updateData)
//   updateData.$push = {
//     updates: {
//       updatedAt: today, // 使用當前日期
//       updatedBy: updateData?.name
//     }
//   }
//   next()
// })
export default model('userPunchrecords', schema)
