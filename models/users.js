import { Schema, model, Error } from 'mongoose'
import bcryptjs from 'bcryptjs'
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
      reqired: [true, '缺少功號'],
      minlength: [4, '4 個字元以上'],
      maxlength: [20, '20 個字元以下'],
      unique: true,
      match: [/^[A-Za-z0-9]+$/, '格式錯誤']
    },
    password: {
      type: String
    },
    tokens: {
      type: [String],
      default: []
    },
    role: {
      type: Number,
      // 0 = 使用者
      // 1 = 管理員
      default: 0
    },
    image: {
      type: String,
      default: undefined
    },
    team: {
      type: String,
      default: '早班',
      enum: {
        values: ['早班', '晚班', '人事', 'PT', '外籍', '責任制']
        // 早班固定加1.5 晚班固定加2
      }
    },
    // 到職年月日
    year: {
      type: String
    },
    month: {
      type: String
    },
    day: {
      type: String
    },
    // 部門
    depart: {
      type: String
    }
  },
  { versionKey: false }
)

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    console.log(user.password)
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcryptjs.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('passwor', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcryptjs.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('passwor', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
    }
  }
  next()
})

export default model('users', schema)
