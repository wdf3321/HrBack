import { DateTime } from 'luxon'
import leave from '../models/leaveRecord.js'
import users from '../models/users.js'

const today = DateTime.now()
// ----------------------------------------------------------------
export const createLeave = async (req, res) => {
  console.log(req.body)
  const find = await leave.findOne({ day: req.body.day, month: req.body.month, number: req.body.number })
  const finduser = await users.findOne({ number: req.body.number })

  if (find) {
    res.status(400).json({ success: false, message: '今天已有紀錄' })
  } else {
    try {
      const result = await leave.create({
        name: finduser.name,
        number: req.body.number,
        ClockIn: req.body?.ClockIn,
        ClockOut: req.body?.ClockOut,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        state: '已審核',
        hours: req.body?.hours,
        team: finduser.team
      })
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
      } else {
        res.status(500).json({ success: false, message: error.message })
        console.log(error)
      }
    }
  }
}

export const findLeave = async (req, res) => {
  try {
    const result = await leave.find({ number: req.params.number, year: today.year, month: req.params.month })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, data: error.message })
    console.log(error)
  }
}

export const editLeave = async (req, res) => {
  try {
    const result = await leave.findOneAndUpdate({ _id: req.body._id }, {
      name: req.body?.name,
      number: req.body.number,
      ClockIn: req.body?.editClockIn,
      ClockOut: req.body?.editClockOut,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      state: '已審核',
      hours: req.body?.hours,
      punchtype: req.body?.punchtype
    })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, data: error.message })
    console.log(error)
  }
}

const roundTimeIn = timeStr => {
  let [hours, minutes] = timeStr.split(':').map(Number)

  if (minutes > 5 && minutes <= 30) {
    minutes = 30
  } else if (minutes > 30) {
    minutes = 0
    hours++
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
//  下班時間至00 30
const roundTimeOut = timeStr => {
  let [hours, minutes] = timeStr.split(':').map(Number)
  if (minutes > 0 && minutes < 30) {
    minutes = 0
  } else if (minutes >= 30) {
    minutes = 30
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
