const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()


router.post('/register', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.set('Authorization', token)
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const data = await User.findByCredentials(email, password)
        if (!data) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await data.generateAuthToken()
        res.set('Authorization', token)
        res.header('ETag', '12345')
            .send({ "status": "success", data, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/user', auth, async(req, res) => {
    // View logged in user profile
    res.set('Authorization', req.user.token)
    res.send(req.user)
})

router.post('/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router