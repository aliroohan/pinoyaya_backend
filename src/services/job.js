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

exports.getJobCountByBabysitterId = async (babysitterId) => {
  let jobs = await jobModel.find({ babysitterId: babysitterId });
  let availableJobs = jobs.filter(job => job.status === 'available');
  let ongoingJobs = jobs.filter(job => job.status === 'ongoing');
  let completedJobs = jobs.filter(job => job.status === 'completed');
  return {
    availableJobs: availableJobs.length,
    ongoingJobs: ongoingJobs.length,
    completedJobs: completedJobs.length
  };
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