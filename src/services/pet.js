const petModel = require('../models/pet');

exports.create = async (data) => {
  return await petModel.create(data);
};

exports.getAll = async (id) => {
  return await petModel.find({customerId: id});
};

exports.update = async (id, data) => {
  return await petModel.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
  return await petModel.findByIdAndDelete(id);
};

