const express = require('express'),
    router = express.Router()

const routes = require('./Routes')
const salle = require('./salle')
const user = require('./user')

router.use('/', routes)
    .use('/auth', user)
    .use('/salles', salle)

module.exports = router