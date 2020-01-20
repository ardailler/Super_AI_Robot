const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        let data = null
        await jwt.verify(token, process.env.JWT_KEY, async function (err, decoded) {
            if (err) {
                // try to remove expired token
                if (err.name === 'TokenExpiredError') {
                    const user = await User.findOne({'tokens.token': token})
                    user.tokens = user.tokens.filter((token_f) => {
                        return token_f.token !== token
                    })
                    await user.save()
                }
                throw new Error()
            } else {
                return decoded
            }
        }).then(function (d) {
            data = d
        }).catch (function (error) {
            throw new Error()
        })
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth