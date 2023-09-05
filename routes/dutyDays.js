import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createDutyDays, finddutyDays, editdutyDays } from '../controllers/dutyDays.js'

const router = Router()

router.post('/create', auth.jwt, createDutyDays)
router.get('/find/:month', auth.jwt, finddutyDays)
router.patch('/edit/:month', auth.jwt, editdutyDays)
export default router
