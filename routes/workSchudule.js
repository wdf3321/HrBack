import { Router } from 'express'
import admin from '../middleware/admin.js'
// import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'
import { createWorkschudule, findAllSchudule, findAllSchuduleByMonth, findAllSchuduleByYear, findSchudule, findSchuduleByMonth, findSchuduleByYear, csvtowork, deleteWorkschudule } from '../controllers/workSchudule.js'

const router = Router()
// 創立班表
router.post('/add', auth.jwt, admin, createWorkschudule)// 上班
// 查自己,某人班表
router.get('/all', auth.jwt, findAllSchudule)
router.get('/month/:month', auth.jwt, findAllSchuduleByMonth)
router.get('/year/:year', auth.jwt, findAllSchuduleByYear)
router.get('/:number', auth.jwt, findSchudule)
router.post('/month/:number', auth.jwt, findSchuduleByMonth)
router.post('/year/:number', auth.jwt, findSchuduleByYear)
// csv導入班表
router.post('/csvtowork', upload, admin, csvtowork)
router.delete('/delete/:id', auth.jwt, admin, deleteWorkschudule)
// // 更改打卡已審核未審核
// router.patch('/check', auth.jwt, checkVacation)
// // 當月總時長
// router.get('/time/:number', auth.jwt, UserTotalWorkTime)
// router.get('/time/:number/:month', auth.jwt, UserTotalWorkTimeByMonth)
// // 編輯打卡紀錄
// router.patch('/approve/edittime', auth.jwt, editVacation)

export default router
