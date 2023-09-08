import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createLeave, findLeave, editLeave } from '../controllers/leave.js'

const router = Router()

router.post('/create', auth.jwt, createLeave)
router.get('/find/:month/:number', findLeave)
router.patch('/edit', auth.jwt, editLeave)
export default router
