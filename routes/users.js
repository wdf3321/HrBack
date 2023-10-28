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
  getAllUser,
  deleteUser,
  editUserAdmin,
  findUserVacation,
  getTeam,
  getUserAdmin
} from '../controllers/users.js'
// --------------------------------------------

const router = Router()
// 註冊
router.post('/', auth.jwt, admin, register)
// 登入
router.post('/login', content('application/json'), auth.login, login)
// 登出
router.delete('/logout', auth.jwt, logout)
// 更新 token
router.patch('/extend', auth.jwt, extend)
// 獲取使用者
router.get('/me', auth.jwt, getUser)
router.get('/admin/:number', auth.jwt, admin, getUserAdmin)
// get team enum
router.get('/team', getTeam)

// ------------------admin------------------
// 獲取全部使用者
router.get('/all', auth.jwt, getAllUser)
router.delete('/delete/:id', auth.jwt, admin, deleteUser)
// -------------------------------------------

// -------------------------------------------
router.get('/allvacation', auth.jwt, admin, findAllUserVacation)
router.get('/vacation/:number', auth.jwt, admin, findUserVacation)

// 編輯使用者
router.patch('/:id', content('application/json'), auth.jwt, admin, editUser)
router.patch('/admin/:id', content('application/json'), auth.jwt, admin, editUserAdmin)
// -------------------------------------------
// router.post('/vacation/find', auth.jwt, findVacationsByDate)
// router.delete('/vacation/delete/:id', auth.jwt, deleteVacation)

export default router
