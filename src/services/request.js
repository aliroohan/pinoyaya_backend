const requestModel = require('../models/request');

exports.create = async (data, user) => {
  if (user.type === 'customer') {
    data.customerId = user.id;
  } else if (user.type === 'babysitter') {
    data.babysitterId = user.id;
  }
  const request = new requestModel(data);
  return await request.save();
};

exports.getByJob = async (jobId) => {
  return await requestModel.find({ jobId: jobId });
};

exports.getByCustomer = async (customerId) => {
  return await requestModel.find({ customerId: customerId });
};

exports.getByBabysitter = async (babysitterId) => {
  return await requestModel.find({ babysitterId: babysitterId });
};

exports.update = async (id, data) => {
  return await requestModel.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
  return await requestModel.findByIdAndDelete(id);
}; 