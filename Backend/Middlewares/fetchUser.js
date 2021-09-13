const jwt = require('jsonwebtoken')
const JWT_SECRET = 'DIVYANSHU'


const fetchUser = (req, res, next) => {
    // get user from jwt and add it to req obj
    const token = req.header('auth-token')
    if (!token) res.status(401).send({ error: "invalid token" })
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user

    } catch (error) {
        res.status(401).send({ error: "invalid token" })
    }

    next()
}

module.exports = fetchUser
