import { Router } from 'express'
import admin from '../middleware/admin.js'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  editUser,
  findAllUserVacation,
  findVacationsByDate,
  getAllUser,
  deleteUser,
  editUserAdmin,
  findUserVacation
} from '../controllers/users.js'
import { createVacation, findVacation, checkVacation, offVacation } from '../controllers/vacation.js'

const router = Router()
// 註冊
router.post('/', content('application/json'), register)
// 登入
router.post('/login', content('application/json'), auth.login, login)
// 登出
router.delete('/logout', auth.jwt, logout)
// 更新 token
router.patch('/extend', auth.jwt, extend)
// 獲取使用者
router.get('/me', auth.jwt, getUser)

// ------------------admin------------------
// 獲取全部使用者
router.get('/all', auth.jwt, admin, getAllUser)
router.delete('/delete/:id', auth.jwt, admin, deleteUser)
// -------------------------------------------

// -------------------------------------------
router.get('/allvacation', auth.jwt, admin, findAllUserVacation)
router.get('/vacation/:number', auth.jwt, findUserVacation)
// 創立打卡紀錄
router.post('/vacation/on', auth.jwt, createVacation)// 上班
router.patch('/vacation/off', auth.jwt, offVacation)// 下班
// 查自己打卡紀錄
router.get('/:number', auth.jwt, findVacation)
// 更改打卡單已審核未審核
router.patch('/vacation/check', auth.jwt, checkVacation)
// 編輯使用者
router.patch('/:id', content('application/json'), auth.jwt, editUser)
router.patch('/admin/:id', content('application/json'), auth.jwt, admin, editUserAdmin)
// 指定日期打卡紀錄
router.post('/vacation/find', auth.jwt, findVacationsByDate)
// router.delete('/vacation/delete/:id', auth.jwt, deleteVacation)

export default router
