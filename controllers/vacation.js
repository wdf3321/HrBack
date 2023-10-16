import users from '../models/users.js'
import userPunchrecords from '../models/userPunchrecords.js'
import { DateTime, Duration } from 'luxon'
import csvtojson from 'csvtojson'
import fs from 'fs/promises'
import calculateHour from '../models/calculateHour.js'
import 'dotenv/config'

const today = DateTime.now()
const year = today.year
const month = today.month.toString().padStart(2, '0')
// const day = today.day
// ----------------------------------------------
// 補上班
export const createVacation = async (req, res) => {
  const find = await userPunchrecords.findOne({ day: req.body.day, month: req.body.month, number: req.body.number })
  const finduser = await users.findOne({ number: req.body.number })

  if (find) {
    const result = await userPunchrecords.findOneAndUpdate({ _id: find._id }, { onClockIn: req.body.time, editClockIn: req.body.time, editClockInStatus: true, remark: req.body?.remark }, { new: true })
    res.status(200).json({ success: true, data: result })
  } else {
    try {
      console.log(req.user)
      const result = await userPunchrecords.create({
        name: finduser.name,
        number: req.body.number,
        onClockIn: req.body?.time,
        editClockIn: roundTimeIn(req.body?.time),
        year: req.body.year,
        month: req.body.month.toString().padStart(2, '0'),
        day: req.body.day.toString().padStart(2, '0'),
        state: '已審核',
        hours: req.body?.hours,
        late: req.body?.late || '0',
        team: finduser.team,
        remark: req.body?.remark,
        editClockInStatus: true,
        $push: { updates: { updatedAt: today, updatedBy: req.user?.name || '補打卡' } }
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
// 補下班
export const offVacation = async (req, res) => {
  try {
    const find = await userPunchrecords.findOne({ day: req.body.day, month: req.body.month, number: req.body.number, year })
    console.log(find)
    if (!find) {
      try {
        const finduser = await users.findOne({ number: req.body.number })
        const result = await userPunchrecords.create({
          name: req.body.name,
          number: req.body.number,
          onClockIn: req.body?.onClockOut,
          onClockOut: req.body?.time,
          editClockIn: req.body?.onClockIn,
          editClockOut: req.body?.time,
          year: req.body.year,
          month: req.body.month.toString().padStart(2, '0'),
          day: req.body.day.toString().padStart(2, '0'),
          state: '已審核',
          hours: req.body?.hours,
          team: finduser.team,
          remark: req.body?.remark,
          editClockOutStatus: true,
          $push: { updates: { updatedAt: today, updatedBy: req.user?.name || '補打卡' } }

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
      return
    }
    const day = parseInt(req.body.day)
    const month = parseInt(req.body.month)
    const startTimeString = await find.editClockIn
    const endTimeString = await req.body.time
    // const formatString = 'HH:mm'
    const startTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: parseInt(startTimeString.split(':')[0]),
      minute: parseInt(startTimeString.split(':')[1])
    })
    const endTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: parseInt(endTimeString.split(':')[0]),
      minute: parseInt(endTimeString.split(':')[1])
    })
    let hours = 0
    let minutes = 0
    if (endTime < startTime) {
      // 跨天情況
      const midnight = DateTime.fromISO('00:00', { zone: 'utc' }).setZone('Asia/Taipei')
      const diffUntilMidnight = midnight.diff(startTime).as('minutes')
      const diffAfterMidnight = endTime.plus({ days: 1 }).diff(midnight).as('minutes')

      hours = Math.floor((diffUntilMidnight + diffAfterMidnight) / 60)
      minutes = (diffUntilMidnight + diffAfterMidnight) % 60
    } else {
      const diffInMillis = endTime.diff(startTime).as('milliseconds')
      const diffInMinutes = diffInMillis / (1000 * 60) // 轉換為分鐘
      hours = Math.floor(diffInMinutes / 60) // 取小時
      minutes = diffInMinutes % 60 // 取餘得分鐘
    }

    // 補零處理
    const formattedHours = Math.abs(hours).toString().padStart(2, '0')
    const formattedMinutes = Math.abs(minutes).toString().padStart(2, '0')

    const sign = hours < 0 || minutes < 0 ? '-' : '' // 判斷是否為負數

    const HourSent = `${sign}${formattedHours}:${formattedMinutes}`

    // ------------------------------------------------
    const result = await userPunchrecords.findOneAndUpdate(
      { day: req.body.day, month: req.body.month, number: req.body.number, year },
      {
        hours: HourSent,
        onClockOut: req.body.time,
        editClockOut: req.body.time,
        editClockOutStatus: true,
        remark: req.body?.remark,
        $push: { updates: { updatedAt: today, updatedBy: req.user?.name || '補打卡' } }
      },
      { new: true }
    )
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, data: error.message })
  }
}

export const findVacation = async (req, res) => {
  const result = await userPunchrecords.find({ number: req.params.number, month, year })
  console.log(result)
  res.status(200).json({ success: true, message: '', result })
}
export const findVacationByMonth = async (req, res) => {
  const result = await userPunchrecords.find({ month: req.body.month, year: req.body.year, number: req.params.number })
  res.status(200).json({ success: true, message: result })
}
export const findVacationByMonthLength = async (req, res) => {
  const result = await userPunchrecords.find({ month: req.body.month, year: req.body.year, number: req.params.number })
  res.status(200).json({ success: true, message: result.length })
}
export const findVacationByYear = async (req, res) => {
  const result = await userPunchrecords.find({ year: req.body.year, number: req.params.number })
  res.status(200).json({ success: true, message: result })
}
export const findAllVacation = async (req, res) => {
  const result = await userPunchrecords.find({})
  res.status(200).json({ success: true, message: result })
}
export const findAllVacationByMonth = async (req, res) => {
  const result = await userPunchrecords.find({ month: req.params.month, year })
  res.status(200).json({ success: true, message: result })
}
export const findAllVacationByYear = async (req, res) => {
  const result = await userPunchrecords.find({ year: req.params.year })
  res.status(200).json({ success: true, message: result })
}
// ------------------------------------------------
export const checkVacation = async (req, res) => {
  try {
    const documentIds = req.body._id
    const results = []

    for (const documentId of documentIds) {
      const result = await userPunchrecords.findByIdAndUpdate(documentId, { state: req.body.state, onClockOut: req.body.onClockOut }, { new: true })
      results.push(result)
    }

    res.status(200).json({ success: true, message: results })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const UserTotalWorkTime = async (req, res) => {
  try {
    const userPunchRecords = await userPunchrecords.find({ number: req.user.number, month })
    let totalDuration = await Duration.fromObject({ hours: 0, minutes: 0 })
    await userPunchRecords.forEach(record => {
      const [hours, minutes] = record.hours.split(':').map(Number)
      const duration = Duration.fromObject({ hours, minutes })
      totalDuration = totalDuration.plus(duration)
    })
    const totalHours = await Math.floor(totalDuration.as('hours'))
    const totalMinutes = (await Math.floor(totalDuration.as('minutes'))) % 60
    const result = await `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    console.error(error)
  }
}

export const UserTotalWorkTimeByMonth = async (req, res) => {
  try {
    const userPunchRecords = await userPunchrecords.find({ number: req.params.number, month: req.params.month })
    let totalDuration = await Duration.fromObject({ hours: 0, minutes: 0 })
    await userPunchRecords.forEach(record => {
      const [hours, minutes] = record.hours.split(':').map(Number)
      const duration = Duration.fromObject({ hours, minutes })
      totalDuration = totalDuration.plus(duration)
    })
    const totalHours = await Math.floor(totalDuration.as('hours'))
    const totalMinutes = (await Math.floor(totalDuration.as('minutes'))) % 60
    const result = await `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    console.error(error)
  }
}

export const editVacation = async (req, res) => {
  try {
    await userPunchrecords.findByIdAndUpdate(
      req.body._id,
      {
        editClockIn: req.body.editClockIn,
        editClockOut: req.body.editClockOut,
        remark: req.body?.remark
      },
      { new: true }
    )
    const find = await userPunchrecords.findOne({ _id: req.body._id })
    const day = parseInt(find.day)
    const month = parseInt(find.month)
    const year = new Date().getFullYear() // 使用当前年份
    const startTimeString = find.editClockIn
    const endTimeString = find.editClockOut

    const startTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: parseInt(startTimeString.split(':')[0]),
      minute: parseInt(startTimeString.split(':')[1])
    }) //eslint-disable-line
    let endTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: parseInt(endTimeString.split(':')[0]),
      minute: parseInt(endTimeString.split(':')[1])
    })

    if (req.body.breaktime === true) {
      endTime = endTime.minus({ hours: 1 })
    }
    if (req.body.breaktimehalf === true) {
      endTime = endTime.minus({ minutes: 30 })
    }
    let hours = 0
    let minutes = 0

    if (endTime < startTime) {
      // 跨天情况
      const midnight = DateTime.fromISO('00:00', { zone: 'utc' }).setZone('Asia/Taipei')
      const diffUntilMidnight = midnight.diff(startTime).as('minutes')
      const diffAfterMidnight = endTime.plus({ days: 1 }).diff(midnight).as('minutes')

      hours = Math.floor((diffUntilMidnight + diffAfterMidnight) / 60)
      minutes = (diffUntilMidnight + diffAfterMidnight) % 60
    } else {
      const diffInMillis = endTime.diff(startTime).as('milliseconds')
      const diffInMinutes = diffInMillis / (1000 * 60) // 转换为分钟
      hours = Math.floor(diffInMinutes / 60) // 取小时
      minutes = diffInMinutes % 60 // 取余得分钟
    }

    // 补零处理
    const formattedHours = Math.abs(hours).toString().padStart(2, '0')
    const formattedMinutes = Math.abs(minutes).toString().padStart(2, '0')

    const sign = hours < 0 || minutes < 0 ? '-' : '' // 判断是否为负数

    const HourSent = `${sign}${formattedHours}:${formattedMinutes}`

    // ------------------------------------------------
    const results = await userPunchrecords.findOneAndUpdate(
      { _id: req.body._id },
      {
        hours: HourSent,
        break: req.body.breakday,
        holiday: req.body.holiday,
        overhourfirst: req.body.overhourfirst,
        overhoursecond: req.body.overhoursecond,
        overhourthird: req.body.overhourthird,
        late: req.body.late,
        leaveEarly: req.body?.leaveEarly,
        $push: {
          updates: {
            updatedAt: today,
            updatedBy: req.user.name
          }
        }
      },
      { new: true }
    )
    res.status(200).json({ success: true, message: results })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// -------------------------------------------------------------------------------------------
// 含加班   台籍正職
export const calculatetotalwork = async (req, res) => {
  const find = await userPunchrecords.find({ number: req.params.number, month: req.params.month, year })
  if (find.length === 0) {
    return res.status(500).send('沒有紀錄') // 返回 500
  }
  const userTeam = '人事'
  let filteredRecords = find

  if (userTeam !== '人事') {
    filteredRecords = filteredRecords.filter(record => record.team === userTeam)
  }

  const uniqueNamesSet = new Set(filteredRecords.map(record => record.name))
  const uniqueNames = Array.from(uniqueNamesSet)

  const rows = []
  for (const name of uniqueNames) {
    const recordsOfThisName = filteredRecords.filter(record => record.name === name)

    let totalHours = 0
    let totalMinutes = 0
    let totalOvertime8to10Hours = 0
    let totalOvertime8to10Minutes = 0
    let totalOvertimeOver10Hours = 0
    let totalOvertimeOver10Minutes = 0

    let totalOvertimeHours = 0
    let totalOvertimeMinutes = 0

    recordsOfThisName.forEach(record => {
      const [hours, minutes] = record.hours.split(':').map(Number)

      if (hours >= 10) {
        const over10Hours = hours - 10
        const over10Minutes = minutes
        totalOvertimeOver10Hours += over10Hours
        totalOvertimeOver10Minutes += over10Minutes
        totalOvertime8to10Hours += 2

        totalOvertimeHours += over10Hours + 2
        totalOvertimeMinutes += over10Minutes
      } else if (hours >= 8) {
        const over8Hours = hours - 8
        const over8Minutes = minutes
        totalOvertime8to10Hours += over8Hours
        totalOvertime8to10Minutes += over8Minutes

        totalOvertimeHours += over8Hours
        totalOvertimeMinutes += over8Minutes
      }

      totalHours += hours
      totalMinutes += minutes
    })

    // Handle overflow of minutes
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60)
      totalMinutes %= 60
    }

    if (totalOvertime8to10Minutes >= 60) {
      totalOvertime8to10Hours += Math.floor(totalOvertime8to10Minutes / 60)
      totalOvertime8to10Minutes %= 60
    }

    if (totalOvertimeOver10Minutes >= 60) {
      totalOvertimeOver10Hours += Math.floor(totalOvertimeOver10Minutes / 60)
      totalOvertimeOver10Minutes %= 60
    }

    if (totalOvertimeMinutes >= 60) {
      totalOvertimeHours += Math.floor(totalOvertimeMinutes / 60)
      totalOvertimeMinutes %= 60
    }

    const formattedTotalHours = String(totalHours).padStart(2, '0')
    const formattedTotalMinutes = String(totalMinutes).padStart(2, '0')
    const formattedOvertime8to10 = `${String(totalOvertime8to10Hours).padStart(2, '0')}:${String(totalOvertime8to10Minutes).padStart(2, '0')}`
    const formattedOvertimeOver10 = `${String(totalOvertimeOver10Hours).padStart(2, '0')}:${String(totalOvertimeOver10Minutes).padStart(2, '0')}`
    const formattedOvertime = `${String(totalOvertimeHours).padStart(2, '0')}:${String(totalOvertimeMinutes).padStart(2, '0')}`
    rows.push({
      name,
      number: recordsOfThisName[0].number,
      count: recordsOfThisName.length,
      hours: `${formattedTotalHours}:${formattedTotalMinutes}`,
      totaloverhour: formattedOvertime,
      overtime8to10: formattedOvertime8to10,
      overtimeOver10: formattedOvertimeOver10
    })

    const docData = {
      name,
      number: recordsOfThisName[0].number,
      totalhour: `${formattedTotalHours}:${formattedTotalMinutes}`,
      totaloverhour: formattedOvertime,
      overhourfirst: formattedOvertime8to10,
      overhoursecond: formattedOvertimeOver10,
      team: recordsOfThisName[0].team,
      year: recordsOfThisName[0].year,
      month: recordsOfThisName[0].month,
      break: recordsOfThisName[0].break,
      holiday: recordsOfThisName[0].holiday
    }

    await calculateHour.findOneAndUpdate(
      {
        name,
        number: recordsOfThisName[0].number,
        month: recordsOfThisName[0].month,
        year: recordsOfThisName[0].year // 新增年份到查詢條件中
      },
      docData,
      { upsert: true }
    )
  }

  res.json(rows)
}

export const findtotalwork = async (req, res) => {
  const result = await calculateHour.findOne({ number: req.params.number, month: req.params.month, year })
  res.status(200).json({ success: true, message: result })
}

export const updateworktime = async (req, res) => {
  const result = await calculateHour.findOneAndUpdate({ number: req.body.number, month: req.body.month, year }, req.body, {
    new: true
  })
  res.status(200).json({ success: true, message: result })
}

// -----------------------------------------------------------------------
export const csvtowork = async (req, res) => {
  const csvFilePath = req.file.path
  const csv = await csvtojson
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      for (let i = 1; i < jsonObj.length; i++) {
        if (jsonObj[i].number === '') {
          continue
        } else {
          userPunchrecords.create({
            number: jsonObj[i].number,
            name: jsonObj[i].name,
            onClockIn: jsonObj[i].onClockIn,
            onClockOut: jsonObj[i].onClockOut,
            editClockIn: jsonObj[i].editClockIn,
            editClockOut: jsonObj[i].editClockOut,
            year: jsonObj[i].year,
            month: jsonObj[i].month,
            day: jsonObj[i].day,
            hours: jsonObj[i].hours,
            team: jsonObj[i].team,
            state: jsonObj[i].state
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

// ----------------------------------------------------------------
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
