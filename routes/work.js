import { Router } from 'express'
import admin from '../middleware/admin.js'
// import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { createVacation, findVacation, findAllVacation, checkVacation, offVacation, UserTotalWorkTime } from '../controllers/vacation.js'

const router = Router()
// 創立打卡紀錄
router.post('/on', auth.jwt, createVacation)// 上班
router.patch('/off', auth.jwt, offVacation)// 下班
// 查自己,某人打卡紀錄
router.get('/all', auth.jwt, admin, findAllVacation)
router.get('/:number', auth.jwt, findVacation)

// 更改打卡已審核未審核
router.patch('/check', admin, auth.jwt, checkVacation)
// 當月總時長
router.get('/time/:number', auth.jwt, UserTotalWorkTime)

export default router
