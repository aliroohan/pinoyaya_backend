const jobModel = require('../models/job');

exports.createJob = async (data) => {
  const job = new jobModel(data);
  return await job.save();
};

exports.getJobs = async () => {
  return await jobModel.find();
};

exports.getJobsByCustomerId = async (customerId) => {
  return await jobModel.find({ customer: customerId });
};

exports.getJobsByBabysitterId = async (babysitterId) => {
  return await jobModel.find({ babysitter: babysitterId });
};

exports.getJobById = async (id) => {
  return await jobModel.findById(id);
};

exports.updateJob = async (id, data) => {
  return await jobModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteJob = async (id) => {
  return await jobModel.findByIdAndDelete(id);
}; 