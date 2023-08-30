import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createLeave } from '../controllers/leave.js'

const router = Router()

router.post('/create', auth.jwt, createLeave)

export default router
