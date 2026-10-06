import { Router } from "express";
import { getAdmin } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, requireRole('admin'), getAdmin)

export default router;