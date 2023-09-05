import dutyDays from '../models/dutyDays.js'
import { DateTime } from 'luxon'

export const createDutyDays = async (req, res) => {
  try {
    const find = await dutyDays.findOne({ year: req.body.year || DateTime.now().year, month: req.body.month })
    if (find) {
      res.status(400).json({ success: false, message: '已創建過本月紀錄' })
      return
    }
    const result = await dutyDays.create({
      year: req.body.year || DateTime.now().year,
      month: req.body.month,
      day: req.body.days,
      $push: {
        updates: {
          updatedAt: DateTime.now(),
          updatedBy: req.user.name
        }
      }
    })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const finddutyDays = async (req, res) => {
  try {
    const result = await dutyDays.find({ year: req.body.year || DateTime.now().year, month: req.params.month })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const editdutyDays = async (req, res) => {
  try {
    const result = await dutyDays.findOneAndUpdate({ year: req.body.year || DateTime.now().year, month: req.params.month }, { day: req.body.days }, { new: true })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}
