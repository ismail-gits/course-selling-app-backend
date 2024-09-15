const { ADMIN_JWT_SECRET } = require("../config")
const jwt = require('jsonwebtoken')

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization
    const words = token.split(" ")
    const jwtToken = words[1]

    try {
        const verifyToken = jwt.verify(jwtToken, ADMIN_JWT_SECRET)
        req.username = verifyToken.username
        next()
    }
    catch(err) {
        console.log(err)
        res.status(403).json({message: "Invalid token, you are not authorized"})
    }
}

module.exports = adminMiddleware