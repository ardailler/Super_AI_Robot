//repositories/TodoRepository

const Salle = require('../models/Salle');

class SalleRepository {

  constructor(model) {
    this.model = model;
  }

  // create a new salle
  create(name, creator) {
    const newSalle = { name, creator};
    const salle = new this.model(newSalle);
    return salle.save();
  }

  // return all salles
  findAll() {
    return this.model.find();
  }
  // return all salles
  findQuery(_id) {
    return this.model.find({creator: _id})
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
  async updateById(id, object) {
    const query = {_id: id};
    const salle = await this.model.findOne(query)
    if (object.name !== undefined && object.name && object.name !== '') {
      salle.name = object.name
    }
    if (object.data !== undefined && object.data && object.data !== '') {
      salle.data = object.data
    }
    await salle.save()
    return salle
  }

  //add Action salle
  async addActionById(id, object) {
    const query = { _id: id }
    const salle = await this.model.findOne(query)
    salle.data = salle.data.concat(object.data)
    await salle.save()
    return salle
  }
}

module.exports = new SalleRepository(Salle);
