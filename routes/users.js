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
import { createVacation, findVacation, deleteVacation, checkVacation } from '../controllers/vacation.js'

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
router.get('/allvacation', auth.jwt, findAllUserVacation)
router.get('/vacation/:name', auth.jwt, findUserVacation)

router.post('/vacation', auth.jwt, createVacation)
router.get('/:id', auth.jwt, findVacation)
router.patch('/:id', content('application/json'), auth.jwt, editUser)
router.patch('/admin/:id', content('application/json'), auth.jwt, editUserAdmin)
router.post('/vacation/find', auth.jwt, findVacationsByDate)
router.delete('/vacation/delete/:id', auth.jwt, deleteVacation)
router.patch('/vacation/check', auth.jwt, checkVacation)

export default router
