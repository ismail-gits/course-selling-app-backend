const { JWT_SECRET } = require("../config")
const jwt = require('jsonwebtoken')

function userMiddleware(req, res, next) {
    const token = req.headers.authorization
    const words = token.split(" ")
    const jwtToken = words[1]

    try {
        const verifyToken = jwt.verify(jwtToken, JWT_SECRET)
        next()
    }
    catch(err) {
        console.log(err)
        res.status(403).json({message: "Invalid token, you are not authorized"})
    }
}

module.exports = userMiddleware