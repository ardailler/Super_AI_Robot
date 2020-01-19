//repositories/TodoRepository

const Salle = require('../models/Salle');

class SalleRepository {

  constructor(model) {
    this.model = model;
  }

  // create a new salle
  create(name) {
    const newSalle = { name, done: false };
    const salle = new this.model(newSalle);
    return salle.save();
  }

  // return all salles
  findAll() {
    return this.model.find();
  }

  //find salle by the id
  findById(id) {
    return this.model.findById(id);
  }

    // delete salle
  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  //update salle
  updateById(id, object) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: { name: object.name, done: object.done } });
  }
}

module.exports = new SalleRepository(Salle);
