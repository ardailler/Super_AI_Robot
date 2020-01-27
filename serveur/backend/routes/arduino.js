const express = require('express')
const repository = require('../respositories/SalleRepository')
const auth = require('../middleware/auth')

const router = express.Router()

// get all salle items in the db
router.get('/', auth, (req, res) => {
    repository.findAll().then((salles) => {
        res.json(salles)
    }).catch((error) => console.log(error))
})
