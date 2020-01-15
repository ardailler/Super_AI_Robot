const express = require('express'),
    router = express.Router()

const routes = require('./Routes')
const user = require('./user')

router.use('/', routes)
    .use('/users', user)

module.exports = router