//models/Salle.js

const mongoose = require('mongoose')

const { Schema } = mongoose

// Define schema for salle items
const salleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  data: [{
    action: {
      type: Map,
      of: String,
      required: true
    }
  }],
}, {
  timestamps: true
})

const Salle = mongoose.model('Salle', salleSchema)

module.exports = Salle