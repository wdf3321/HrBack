import { Router } from 'express'
import admin from '../middleware/admin.js'
// import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'
import { createVacation, findVacation, findVacationByMonth, findVacationByYear, findAllVacation, findAllVacationByMonth, findAllVacationByYear, checkVacation, offVacation, UserTotalWorkTime, UserTotalWorkTimeByMonth, editVacation, findVacationByMonthLength, csvtowork, calculatetotalwork, findtotalwork, updateworktime } from '../controllers/vacation.js'

const router = Router()
// 創立打卡紀錄
router.post('/on', auth.jwt, createVacation)// 上班
router.patch('/off', auth.jwt, offVacation)// 下班
// 查自己,某人打卡紀錄
router.get('/all', auth.jwt, admin, findAllVacation)
router.get('/month/:month', auth.jwt, findAllVacationByMonth)
router.get('/year/:year', auth.jwt, findAllVacationByYear)
router.get('/:number', auth.jwt, findVacation)
router.post('/month/:number', auth.jwt, findVacationByMonth)
router.post('/monthlength/:number', auth.jwt, findVacationByMonthLength)
router.post('/year/:number', auth.jwt, findVacationByYear)
// 更改打卡已審核未審核
router.patch('/check', auth.jwt, checkVacation)
// 當月總時長
router.get('/time/:number', auth.jwt, UserTotalWorkTime)
router.get('/time/:number/:month', auth.jwt, UserTotalWorkTimeByMonth)
// 編輯打卡紀錄
router.patch('/approve/edittime', auth.jwt, editVacation)
// csv 匯入
router.post('/csvtowork', upload, csvtowork)
// calculate
router.get('/calculate/:number/:month', auth.jwt, findtotalwork)
router.post('/calculate/:number/:month', auth.jwt, calculatetotalwork)
router.post('/calculate/update', auth.jwt, updateworktime)
export default router
