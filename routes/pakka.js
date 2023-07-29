import { Router } from 'express'
import { getpunch, getmember } from '../controllers/pakka.js'
import schedule from 'node-schedule'
const router = Router()
const hour = schedule.scheduleJob('*/5 * * * * ', function () {
  console.log(new Date() + 'every hour')
  getpunch()
  getmember()
})

export default router
