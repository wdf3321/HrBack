import { Router } from 'express'
import { getpunch, getmember } from '../controllers/pakka.js'
// import schedule from 'node-schedule'
const router = Router()
// const hour = schedule.scheduleJob('1 * * * * ', function () {
//   console.log(new Date() + 'every 5min')
getpunch()
getmember()
// })
setInterval(() => {
  getpunch()
}, 100000)
setInterval(() => {
  getmember()
}, 100000)
export default router
