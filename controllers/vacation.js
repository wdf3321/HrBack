// import users from '../models/users.js'
import userPunchrecords from '../models/userPunchrecords.js'
import { DateTime, Duration } from 'luxon'

export const createVacation = async (req, res) => {
  const find = await userPunchrecords.findOne({ day: req.body.day, month: req.body.month, number: req.user.number })
  if (find) {
    res.status(500).json({ success: false, message: '你今天已打過卡' })
  } else {
    try {
      const result = userPunchrecords.create({
        name: req.user.name,
        number: req.user.number,
        onClockIn: req.body.onClockIn,
        onClockOut: req.body.onClockOut,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        state: req.body.state,
        hours: req.body.hours
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

export const offVacation = async (req, res) => {
  try {
    const find = await userPunchrecords.findOne({ day: req.body.day, month: req.body.month, number: req.user.number })
    const day = parseInt(req.body.day)
    const month = parseInt(req.body.month)
    const year = new Date().getFullYear() // 使用當前年份
    const startTimeString = await find.onClockIn
    const endTimeString = await req.body.onClockOut
    // const formatString = 'HH:mm'

    const startTime = DateTime.fromObject({ year, month, day, hour: parseInt(startTimeString.split(':')[0]), minute: parseInt(startTimeString.split(':')[1]) })
    const endTime = DateTime.fromObject({ year, month, day, hour: parseInt(endTimeString.split(':')[0]), minute: parseInt(endTimeString.split(':')[1]) })

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

    const sign = (hours < 0 || minutes < 0) ? '-' : '' // 判斷是否為負數

    const HourSent = `${sign}${formattedHours}:${formattedMinutes}`

    console.log(HourSent)

    // ------------------------------------------------
    const result = await userPunchrecords.findOneAndUpdate(
      { day: req.body.day, month: req.body.month, number: req.user.number },
      { hours: HourSent, onClockOut: req.body.onClockOut },
      { new: true }
    )
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const findVacation = async (req, res) => {
  const result = await userPunchrecords.find({ number: req.params.number, month: DateTime.now().month, year: DateTime.now().year })
  res.status(200).json({ success: true, message: '', result })
}
export const findVacationByMonth = async (req, res) => {
  const result = await userPunchrecords.find({ month: req.body.month, year: DateTime.now().year, number: req.params.number })
  res.status(200).json({ success: true, message: result })
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
  const result = await userPunchrecords.find({ month: req.params.month, year: DateTime.now().year })
  res.status(200).json({ success: true, message: result })
}
export const findAllVacationByYear = async (req, res) => {
  const result = await userPunchrecords.find({ year: req.params.year })
  res.status(200).json({ success: true, message: result })
}
// ------------------------------------------------
export const checkVacation = async (req, res) => {
  try {
    const documentIds = req.body.id
    const results = []

    for (const documentId of documentIds) {
      const result = await userPunchrecords.findByIdAndUpdate(documentId, { state: req.body.state }, { new: true })
      results.push(result)
    }

    res.status(200).json({ success: true, message: results })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const UserTotalWorkTime = async (req, res) => {
  try {
    const userPunchRecords = await userPunchrecords.find({ number: req.user.number, month: DateTime.now().month })
    let totalDuration = await Duration.fromObject({ hours: 0, minutes: 0 })
    await userPunchRecords.forEach(record => {
      const [hours, minutes] = record.hours.split(':').map(Number)
      const duration = Duration.fromObject({ hours, minutes })
      totalDuration = totalDuration.plus(duration)
    })
    const totalHours = await Math.floor(totalDuration.as('hours'))
    const totalMinutes = await Math.floor(totalDuration.as('minutes')) % 60
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
    const totalMinutes = await Math.floor(totalDuration.as('minutes')) % 60
    const result = await `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    console.error(error)
  }
}

// export const deleteVacation = async (req, res) => {
//   try {
//     const user = await users.findOne({ account: req.user.account })
//     const vacation = users.vacation._id(req.params._id)
//     vacation.remove()
//     await user.save()
//     res.status(200).json({ success: true, message: 'Vacation deleted successfully' })
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Unable to delete vacation' })
//   }
// }

// export const checkVacation = async (req, res) => {
//   try {
//     const userwithVacation = await users.find().populate('vacation')
//     const userPunchrecords = userwithVacation.flatMap(users => users.vacation)
//     const result = userwithVacation.findOneAndUpdate({ _id: req.body.id }, req.body)
//     console.log(result)
//     res.status(200).json({ success: true, message: userPunchrecords })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// 保存所有记录的数组
