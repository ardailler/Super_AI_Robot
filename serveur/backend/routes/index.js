const express = require('express'),
    router = express.Router()

const routes = require('./Routes')
const user = require('./user')

router.use('/', routes)
    .use('/auth', user)

module.exports = router