import manualPunchrecords from '../models/manualPunchrecords'

import { DateTime } from 'luxon'
// -------------------------------------
const today = DateTime.now()
const year = today.year
const month = today.month.toString().padStart(2, '0')
const day = today.day

export const create = async (req, res) => {
  const result = await manualPunchrecords.create({
    type: req.body.type,
    name: req.body.name,
    number: req.body.number,
    title: req.body.title,
    onClockIn: req.body.onClockIn,
    onClockOut: req.body.onClockOut
  })
  res.status(200).json({ success: true, message: result })
}
