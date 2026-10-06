import { Router } from 'express'
import { signupController, loginController, meController, logoutController } from '../controllers/authController.js'

const router = Router()

router.post('/signup', signupController)

router.post('/login', loginController)

router.get('/me', meController)

router.post('/logout', logoutController)

export default router;