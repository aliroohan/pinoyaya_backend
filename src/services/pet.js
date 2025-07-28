const pet = require('../models/pet');

exports.getAll = async () => {
  return await pet.find();
};

exports.update = async (id, data) => {
  return await pet.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
  return await pet.findByIdAndDelete(id);
};

