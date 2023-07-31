import manualPunchrecords from '../models/manualPunchrecords.js'

// import { DateTime } from 'luxon'
// -------------------------------------
// const today = DateTime.now()
// const year = today.year
// const month = today.month.toString().padStart(2, '0')
// const day = today.day

export const create = async (req, res) => {
  const result = await manualPunchrecords.create({
    type: req.body.type,
    name: req.body.name,
    number: req.body.number,
    title: req.body.title,
    onClockIn: req.body.onClockIn,
    onClockOut: req.body.onClockOut,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day

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
