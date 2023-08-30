import { DateTime } from 'luxon'
import leave from '../models/leaveRecord.js'
import users from '../models/users.js'

const today = DateTime.now()
// ----------------------------------------------------------------
export const createLeave = async (req, res) => {
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
