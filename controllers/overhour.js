import manualPunchrecords from '../models/manualPunchrecords.js'

import { Duration, DateTime } from 'luxon'
// -------------------------------------
// const today = DateTime.now()
// const year = today.year
// const month = today.month.toString().padStart(2, '0')
// const day = today.day

export const create = async (req, res) => {
  const { type, name, number, title, onClockIn, onClockOut, year, month, day } = req.body
  const { overhourfirst, overhoursecond, overhourthree } = await calculateOverhour(onClockIn, onClockOut, type)
  const totalHours = await totalhourscalculate(onClockIn, onClockOut)
  console.log(totalHours)
  const result = await manualPunchrecords.create({
    type,
    name,
    number,
    title,
    onClockIn,
    onClockOut,
    year,
    month,
    day,
    hours: totalHours,
    overhourfirst,
    overhoursecond,
    overhourthree // spread overhours object to assign overhourfirst, overhoursecond, and overhourthree
  })

  res.status(200).json({ success: true, message: result })
}

export const approve = async (req, res) => {
  const result = await manualPunchrecords.findOneAndUpdate({
    _id: req.body._id,
    name: req.body.name,
    number: req.body.number
  }, {
    state: '已審核'
  }, { new: true })
  res.status(200).json({ success: true, message: result })
}

export const getSelect = async (req, res) => {
  const teamEnumValues = manualPunchrecords.schema.path('type').enumValues
  res.json(teamEnumValues)
}

const calculateOverhour = async (val1, val2, type) => {
  let overhourfirst = 0
  let overhoursecond = 0
  let overhourthree = 0

  // Parse val1 and val2 to DateTime objects
  const time1 = DateTime.fromFormat(val1, 'HH:mm')
  const time2 = DateTime.fromFormat(val2, 'HH:mm')

  // Calculate the difference between the two times
  const diff = time2.diff(time1, 'hours')

  // Convert the difference to a number representing total hours
  const totalHours = diff.hours

  if (type === '一般加班' || type === '休假日加班') {
    if (totalHours <= 2) {
      overhourfirst = totalHours
    } else {
      overhourfirst = 2
      overhoursecond = totalHours - 2
    }
  } else if (type === '國定假日加班' || type === '例假日加班') {
    overhourthree = totalHours
  }

  return { overhourfirst, overhoursecond, overhourthree }
}
// 算時長
const totalhourscalculate = async (val1, val2) => {
  const time1 = DateTime.fromFormat(val1, 'HH:mm')
  const time2 = DateTime.fromFormat(val2, 'HH:mm')

  // Calculate the difference between the two times
  const diff = time2.diff(time1, 'hours')
  // Convert the difference to a number representing total hours
  const totalHours = diff.hours
  return totalHours
}
