const job = require('../models/job');

exports.createJob = async (data) => {
  const job = new job(data);
  return await job.save();
};

exports.getJobs = async () => {
  return await job.find();
};

exports.getJobsByCustomerId = async (customerId) => {
  return await job.find({ customer: customerId });
};

exports.getJobsByBabysitterId = async (babysitterId) => {
  return await job.find({ babysitter: babysitterId });
};

exports.getJobById = async (id) => {
  return await job.findById(id);
};

exports.updateJob = async (id, data) => {
  return await job.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteJob = async (id) => {
  return await job.findByIdAndDelete(id);
}; 