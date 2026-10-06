import { getCurrentUser } from "../services/authService.js"

export async function requireAuth(req, res, next) {

    try {
        // session check
        const userIdInSession = req.session.userId

        // if not authenticated
        // return 401
        if (!userIdInSession) {
            return res.status(401).json({
                error: true,
                message: 'You are not logged-in/authorized. Please Login with valid credentials!'
            })
        }

        // if authenticated
        // next()
        const { status, json } = await getCurrentUser(userIdInSession)

        if (status !== 200) {
            return res.status(status).json(json)
        }

        const { user } = json;
        req.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }

        next()
    } catch (error) {
        console.log('error in auth middleware !', error)
        return res.status(500).json({
            error: true,
            message: 'something went wrong in the server!'
        })
    }
}

export function requireRole(role) {
    return function (req, res, next) {
        if (req.currentUser.role !== role) {
            return res.status(403).json({
                error: true,
                message: 'You are not authorized to access this resource'
            })
        }

        next()
    }
}