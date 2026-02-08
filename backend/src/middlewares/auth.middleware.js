const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decode.id)
        req.user = user

        next()
    }
    catch (err) {
        res.status(401).json({ message: "Unauthorized" })
    }

}

module.exports = authMiddleware