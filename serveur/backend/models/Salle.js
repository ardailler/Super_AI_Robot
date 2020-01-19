//models/Todo.js

const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for salle items
const salleSchema = new Schema({
  name: {
    type: String,
  },
  done: {
    type: Boolean,
  },
});

const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle;