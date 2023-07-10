import workschedule from '../models/workSchedule.js'
import { DateTime } from 'luxon'
import csvtojson from 'csvtojson'
import fs from 'fs/promises'

export const createWorkschudule = async (req, res) => {
  const find = await workschedule.findOne({ day: req.body.day, month: req.body.month, number: req.body.number })
  if (find) {
    res.status(500).json({ success: false, message: '已加入班表' })
  } else {
    try {
      const result = await workschedule.create({
        name: req.body.name,
        number: req.body.number,
        place: req.body.place,
        ClockIn: req.body.ClockIn,
        ClockOut: req.body.ClockOut,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        hours: req.body.hours,
        team: req.body.team
      })
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
      } else {
        res.status(500).json({ success: false, message: error.message })
      }
    }
  }
}
// -----------------------------------------------

export const findSchudule = async (req, res) => {
  const result = await workschedule.find({ number: req.params.number, month: DateTime.now().month, year: DateTime.now().year })
  res.status(200).json({ success: true, message: '', result })
}
export const findSchuduleByMonth = async (req, res) => {
  const result = await workschedule.find({ month: req.body.month, year: req.body.year, number: req.params.number })
  res.status(200).json({ success: true, message: result })
}
export const findSchuduleByYear = async (req, res) => {
  const result = await workschedule.find({ year: req.body.year, number: req.params.number })
  res.status(200).json({ success: true, message: result })
}
export const findAllSchudule = async (req, res) => {
  const result = await workschedule.find({})
  res.status(200).json({ success: true, message: result })
}
export const findAllSchuduleByMonth = async (req, res) => {
  const result = await workschedule.find({ month: req.params.month, year: DateTime.now().year })
  res.status(200).json({ success: true, message: result })
}
export const findAllSchuduleByYear = async (req, res) => {
  const result = await workschedule.find({ year: req.params.year })
  res.status(200).json({ success: true, message: result })
}

export const csvtowork = async (req, res) => {
  const csvFilePath = req.file.path
  console.log(req.file.path)
  const csv = await csvtojson
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      for (let i = 1; i < jsonObj.length; i++) {
        if (jsonObj[i].number === '') {
          continue
        } else {
          workschedule.create({
            number: jsonObj[i].number,
            name: jsonObj[i].name,
            place: jsonObj[i].place,
            ClockIn: jsonObj[i].ClockIn,
            ClockOut: jsonObj[i].ClockOut,
            year: jsonObj[i].year,
            month: jsonObj[i].month,
            day: jsonObj[i].day,
            hours: jsonObj[i].hours,
            team: jsonObj[i].team
          })
        }
      }

      // 删除文件
      fs.unlink(csvFilePath)
        .then(() => console.log(`文件 ${csvFilePath} 已被删除`))
        .catch(err => console.error(`删除文件 ${csvFilePath} 时出错：`, err))
    })
  res.status(200).json({
    success: true,
    message: '已收到'
  })
}
