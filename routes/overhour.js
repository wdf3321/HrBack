import { Router } from 'express'
import { approve, create, getAllOvertime, getSelect } from '../controllers/overhour.js'
import * as auth from '../middleware/auth.js'
const router = Router()

router.post('/create', create)
router.post('/approve', approve)
router.get('/type', getSelect)
router.get('/all', auth.jwt, getAllOvertime)
// console.log('aaa')
export default router
