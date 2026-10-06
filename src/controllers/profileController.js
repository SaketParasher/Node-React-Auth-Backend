export function getProfile(req, res) {
    return res.status(200).json({
        error: false,
        user: req.currentUser
    })

}