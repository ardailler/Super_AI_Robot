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

// add a salle item
router.post('/', auth, (req, res) => {
    const { name } = req.body
    repository.create(name).then((salle) => {
        res.json(salle)
    }).catch((error) => console.log(error))
})

// delete a salle item
router.delete('/:id', auth, (req, res) => {
    const { id } = req.params
    repository.deleteById(id).then(() => {
        console.log(`Deleted record with id: ${id}`)
        res.status(200).json([])
    }).catch((error) => console.log(error))
})

// get a salle item
router.get('/:id', auth, (req, res) => {
    const { id } = req.params
    repository.findById(id).then((salle) => {
        res.status(200).json(salle)
    }).catch((error) => console.log(error))
})

// update a salle item
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params
    const salle = { name: req.body.name, data: req.body.data }
    repository.updateById(id, salle)
        .then((salle) => {
            res.status(200).json(salle)
        })
        .catch((error) => console.log(error))
})

// add action in a salle item
router.post('/:id', auth, async (req, res) => {
    const { id } = req.params
    const salle = { data: req.body.data }
    repository.addActionById(id, salle)
        .then((salle) => {
            res.status(200).json(salle)
        })
        .catch((error) => console.log(error))
})


module.exports = router