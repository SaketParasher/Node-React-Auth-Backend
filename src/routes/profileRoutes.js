import { Router } from 'express'
import { getProfile } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/profile', requireAuth, getProfile)

export default router