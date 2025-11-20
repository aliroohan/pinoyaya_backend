const requestModel = require('../models/request');
const jobModel = require('../models/job');

exports.create = async (data, user) => {
  if (user.type === 'customer') {
    data.customerId = user.id;
    data.createdby = 'customer';
  } else if (user.type === 'babysitter') {
    data.babysitterId = user.id;
    data.createdby = 'babysitter';
  }
  if (data.jobId) {
    const job = await jobModel.findById(data.jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    const request = await requestModel.findOne({ jobId: data.jobId, customerId: data.customerId, babysitterId: data.babysitterId });
    if (request) {
      throw new Error('Request already exists for this job');
    }
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

exports.babysitterAcceptRequest = async (requestId) => {
  const request = await requestModel.findByIdAndUpdate(requestId, { status: 'accepted' }, { new: true });
  const job = await jobModel.findByIdAndUpdate(request.jobId, { status: 'ongoing' }, { new: true });
  return { request, job };
};

exports.babysitterRejectRequest = async (requestId) => {
  const request = await requestModel.findByIdAndUpdate(requestId, { status: 'rejected' }, { new: true });
  const job = await jobModel.findByIdAndUpdate(request.jobId, { status: 'cancelled' }, { new: true });
  return { request, job };
};

exports.customerAcceptRequest = async (requestId) => {
  const request = await requestModel.findByIdAndUpdate(requestId, { status: 'accepted' }, { new: true });
  const job = await jobModel.findByIdAndUpdate(request.jobId, { status: 'ongoing', babysitterId: request.babysitterId }, { new: true });
  return { request, job };
};

exports.customerRejectRequest = async (requestId) => {
  const request = await requestModel.findByIdAndUpdate(requestId, { status: 'rejected' }, { new: true });
  return { request, job };
};