import { Schema, model } from 'mongoose'
// import bcryptjs from 'bcryptjs'
// import vacations from './vacations.js'

const schema = new Schema(
  {
    // 名字
    name: {
      type: String
    },
    // 工號
    number: {
      type: String,
      required: [true, '缺少工號'],
      minlength: [4, '4 個字元以上'],
      maxlength: [20, '20 個字元以下'],
      match: [/^[A-Za-z0-9]+$/, '格式錯誤']
    },
    totalhour: {
      type: String,
      required: true
    },
    overhourfirst: {
      type: String,
      default: 0
    },
    overhoursecond: {
      type: String,
      // 0 = 使用者
      // 1 = 管理員
      default: 0
    },
    overhourthree: {
      type: String,
      default: 0
    },
    team: {
      type: String,
      default: '早班',
      enum: {
        values: ['早班', '晚班', '人事', 'PT', '外籍']
      }
    },
    // 到職年月日
    year: {
      type: String
    },
    month: {
      type: String
    },
    break: {
      type: String
    },
    holiday: {
      type: String
    }
  },

  { versionKey: false }
)
schema.index({ number: 1, month: 1 }, { unique: true })
export default model('calculatehour', schema)
