import workerIndeed from '../models/workerIndeed.js'
import { DateTime } from 'luxon'

export const createIndeed = async (req, res) => {
  try {
    const result = await workerIndeed.create({
      date: req.body.date,
      year: req.body.year,
      month: req.body.month,
      needworker: req.body.needworker,
      available: req.body.available,
      cowork: req.body.cowork,
      added: true,
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

export const editIndeed = async (req, res) => {
  try {
    const result = await workerIndeed.findOneAndUpdate({ date: req.body.date }, {
      needworker: req.body.needworker,
      available: req.body.available,
      cowork: req.body.cowork,
      $push: {
        updates: {
          updatedAt: DateTime.now(),
          updatedBy: req.user.name
        }
      }
    }, { new: true })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}
export const findIndeed = async (req, res) => {
  try {
    const result = await workerIndeed.find({ date: req.body.date })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const findIndeedMonth = async (req, res) => {
  try {
    const result = await workerIndeed.find({ year: req.body.year, month: req.body.month })
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}
