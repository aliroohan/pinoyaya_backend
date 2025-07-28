const request = require('../models/request');

exports.create = async (data) => {
  const request = new request(data);
  return await request.save();
};

exports.getByJob = async (jobId) => {
  return await request.find({ job: jobId });
};

exports.getByCustomer = async (customerId) => {
  return await request.find({ customer: customerId });
};

exports.getByBabysitter = async (babysitterId) => {
  return await request.find({ babysitter: babysitterId });
};

exports.update = async (id, data) => {
  return await request.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
  return await request.findByIdAndDelete(id);
}; 