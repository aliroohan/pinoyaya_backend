const jobModel = require('../models/job');

exports.createJob = async (data) => {
  const job = new jobModel(data);
  return await job.save();
};

exports.getJobs = async () => {
  return await jobModel.find().populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobsByCustomerId = async (customerId) => {
  return await jobModel.find({ customerId: customerId }).populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobsByBabysitterId = async (babysitterId) => {
  return await jobModel.find({ babysitterId: babysitterId }).populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobById = async (id) => {
  return await jobModel.findById(id).populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.updateJob = async (id, data) => {
  return await jobModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteJob = async (id) => {
  return await jobModel.findByIdAndDelete(id);
}; 