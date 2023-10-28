import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import { createIndeed, findIndeed, editIndeed, findIndeedMonth } from '../controllers/workerIndeed.js'

const router = Router()

router.post('/create', auth.jwt, createIndeed)
router.post('/find', auth.jwt, findIndeed)
router.post('/find/month', auth.jwt, findIndeedMonth)
router.patch('/edit', auth.jwt, editIndeed)
export default router
