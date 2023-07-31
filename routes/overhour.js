import { Router } from 'express'
import { approve, create, getSelect } from '../controllers/overhour.js'
const router = Router()

router.post('/create', create)
router.post('/approve', approve)
router.get('/type', getSelect)
// console.log('aaa')
export default router
