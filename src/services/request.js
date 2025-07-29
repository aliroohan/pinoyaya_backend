const requestModel = require('../models/request');

exports.create = async (data) => {
  const request = new requestModel(data);
  return await request.save();
};

exports.getByJob = async (jobId) => {
  return await requestModel.find({ job: jobId });
};

exports.getByCustomer = async (customerId) => {
  return await requestModel.find({ customer: customerId });
};

exports.getByBabysitter = async (babysitterId) => {
  return await requestModel.find({ babysitter: babysitterId });
};

exports.update = async (id, data) => {
  return await requestModel.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
  return await requestModel.findByIdAndDelete(id);
}; 