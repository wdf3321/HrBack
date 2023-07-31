import axios from 'axios'
import FormData from 'form-data'
import { DateTime } from 'luxon'
// import { register } from './users.js'
import users from '../models/users.js'
import userPunchrecords from '../models/userPunchrecords.js'
// pakka get
const today = DateTime.now()

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/2010'
  // add more User-Agent strings as needed
]
const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)]
}

// ----------------------------------------------------------------
const form = new FormData()
form.append('company_token', process.env.company_token)

export const getpunch = async () => {
  console.log('getting punch...')
  try {
    const { data } = await axios.post('https://ent.pakka.ai/api/punches/fetch', form, {
      headers: { 'User-Agent': getRandomUserAgent() }
    })
    const punchRecord = []
    for (let i = 0; i < data.formated_punches.length; i++) {
      const timemark = data.formated_punches[i].timemark
      punchRecord.push({
        timemark,
        emp_id: data.formated_punches[i].emp_id,
        display_name: data.formated_punches[i].display_name,
        act: data.formated_punches[i].act,
        location_id: data.formated_punches[i].location_id,
        year: timemark.substring(0, 4),
        month: timemark.substring(5, 7),
        day: timemark.substring(8, 10),
        time: timemark.substring(11, 16)
      })
    }
    for (let i = 0; i < punchRecord.length; i++) {
      const date = DateTime.fromISO(punchRecord[i].timemark)
      const finduser = await users.findOne({ number: punchRecord[i].emp_id })
      // 搜當天打卡
      const findpunch = await userPunchrecords.findOne({
        number: punchRecord[i].emp_id,
        year: punchRecord[i].year,
        month: punchRecord[i].month,
        day: punchRecord[i].day
      })
      // 搜昨天打卡
      const findpunchyesterday = await userPunchrecords.findOne({
        number: punchRecord[i].emp_id,
        year: punchRecord[i].year,
        month: punchRecord[i].month,
        day: date.minus({ days: 1 }).toFormat('dd')
      })
      console.log(finduser, findpunch, findpunchyesterday)
      await handleClockIn(punchRecord[i], finduser, findpunch)
      await handleClockOut(punchRecord[i], finduser, findpunch, findpunchyesterday)
    }
  } catch (error) {
    console.error(error)
  }
}

// ------------------------------------------------------------------------------------------------

const form2 = new FormData()
form2.append('company_token', process.env.company_token)
form2.append('account_token', process.env.account_token)

export const getmember = async () => {
  const staffs = []
  setTimeout(async () => {
    console.log('getting member...')
    staffs.splice(0, staffs.length)
    const { data } = await axios.post('https://ent.pakka.ai/api/staffs/list', form2, {
      headers: { 'User-Agent': getRandomUserAgent() }
    })
    staffs.push(data.staffs)
    for (const staff of data.staffs) {
      try {
        await users.create({
          name: staff.full_name,
          number: staff.emp_id,
          password: staff.emp_id,
          image: 'https://ent.pakka.ai' + staff.avatar || '',
          role: 0
        })
      } catch (error) {
        if (error.name !== 'MongoServerError' || error.code !== 11000) {
          console.error(error) // log unexpected errors
        }
        // if it's a MongoDB duplicate key error, just skip and continue with the next staff
      }
    }
  }, 2000)
}

// full_name  emp_id

// 時間計算 function
const hourcalculate = (val1, val2) => {
  const day = today.day
  const month = today.month
  const year = today.year
  const startTimeString = val1
  const endTimeString = val2
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
  return HourSent
}

// ------------------------------------------------------------------------------------------------
export const handleClockIn = async (record, finduser, findpunch) => {
  // 上班打卡
  if (finduser.number === record.emp_id && record.act === 1) {
    if (findpunch) {
      console.log(findpunch.name + '已有紀錄')
    } else {
      await userPunchrecords.create({
        name: finduser.name,
        number: finduser.number,
        onClockIn: record.time,
        editClockIn: record.time,
        year: record.year,
        month: record.month,
        day: record.day,
        team: finduser.team
      })
    }
  }
}

export const handleClockOut = async (record, finduser, findpunch, findpunchyesterday) => {
  // 下班打卡
  if (finduser.number === record.emp_id && record.act === 2) {
    if (findpunchyesterday && !findpunch) {
      await userPunchrecords.updateOne(
        { _id: findpunchyesterday._id },
        {
          onClockOut: record.time,
          editClockOut: record.time,
          hours: hourcalculate(findpunchyesterday.onClockIn, record.time)
        }
      )
    } else if (findpunchyesterday && findpunch) {
      await userPunchrecords.updateOne(
        { _id: findpunch._id },
        {
          onClockOut: record.time,
          editClockOut: record.time,
          hours: hourcalculate(findpunch.onClockIn, record.time)
        }
      )
    } else if (!findpunchyesterday && findpunch) {
      await userPunchrecords.updateOne(
        { _id: findpunch._id },
        {
          onClockOut: record.time,
          editClockOut: record.time,
          hours: hourcalculate(findpunch.onClockIn, record.time)
        }
      )
    }
  }
}
