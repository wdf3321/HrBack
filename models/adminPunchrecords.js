import { Schema, model, ObjectId } from 'mongoose'
const schema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少使用者']
    },
    Punchrecord: {
      type: [
        {
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
        }
      ],
      default: []
    },
    checkClockIn: {
      type: String,
      default: ''
    },
    checkClockOut: {
      type: String,
      default: ''
    },
    totalHours: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false }
)

export default model('adminPunchrecords', schema)
