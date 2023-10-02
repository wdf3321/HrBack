import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createLeave, findLeave, editLeave } from '../controllers/leave.js'
import admin from '../middleware/admin.js'

const router = Router()

router.post('/create', auth.jwt, admin, createLeave)
router.get('/find/:month/:number', findLeave)
router.patch('/edit', auth.jwt, admin, editLeave)
export default router
