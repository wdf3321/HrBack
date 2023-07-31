import { Router } from 'express'
import { getpunch, getmember } from '../controllers/pakka.js'
import schedule from 'node-schedule'
const router = Router()
const hour = schedule.scheduleJob('*/5 * * * * ', function () {
  console.log(new Date() + 'every 5min')
  getpunch()
  getmember()
})
getpunch()
export default router
