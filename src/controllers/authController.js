
import { signup, login, getCurrentUser } from '../services/authService.js'
import { promisify } from 'util'

export async function signupController(req, res) {
    const { name, email, password } = req.body;
    try {
        const { json, status } = await signup(name, email, password)
        return res.status(status).json(json)
    } catch (error) {
        console.log("Error in creating user ", error)
        return res.status(500).json({
            error: true,
            message: 'Something Went Wrong at server :('
        })
    }
}

export async function loginController(req, res) {
    const { email, password } = req.body;
    try {
        const { json, status } = await login(email, password)

        const promisifiedRegenerateSession = promisify(req.session.regenerate.bind(req.session))
        const promisifiedSaveSession = promisify(req.session.save.bind(req.session))



        if (status === 200 && !json.error) {
            await promisifiedRegenerateSession()
            req.session.userId = json.user.id
            await promisifiedSaveSession()
        }
        return res.status(status).json(json)

    } catch (error) {
        console.log("Error in Login!! ", error)
        return res.status(500).json({
            error: true,
            message: 'Something Went Wrong at server :('
        })
    }
}

export async function meController(req, res) {
    try {
        const userIdFromSession = req.session.userId;
        if (!userIdFromSession) {
            return res.status(401).json({
                error: true,
                message: 'You are not Authorized. Please Log in with valid credentials'
            })
        }

        const { json, status } = await getCurrentUser(userIdFromSession)
        return res.status(status).json(json)
    } catch (error) {
        console.log("Error in me Controller!! ", error)
        return res.status(500).json({
            error: true,
            message: 'Something Went Wrong at server :('
        })
    }
}

export function logoutController(req, res) {
    try {
        if (!req.session) {
            return res.status(400).json({
                error: true,
                message: 'No Active session found'
            })
        }

        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: 'something went wrong! please try later'
                })
            }

            res.clearCookie("connect.sid")
            return res.status(200).json({
                error: false,
                message: 'Logout Success'
            })
        })

    } catch (error) {
        console.log("Error in logout controller ", error)
        return res.status(500).json({
            error: true,
            message: 'something went wrong in server'
        })
    }
}