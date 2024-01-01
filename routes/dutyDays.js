import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createDutyDays, finddutyDays, editdutyDays } from '../controllers/dutyDays.js'
import admin from '../middleware/admin.js'

const router = Router()

router.post('/create', auth.jwt, admin, createDutyDays)
router.get('/find/:year/:month', auth.jwt, finddutyDays)
router.patch('/edit/:month', auth.jwt, admin, editdutyDays)
export default router
