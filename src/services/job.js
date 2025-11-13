const jobModel = require('../models/job');

exports.createJob = async (data) => {
  const job = new jobModel(data);
  return await job.save();
};

exports.getJobs = async () => {
  return await jobModel.find().populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobsByCustomerId = async (customerId) => {
  let onGoing = [];
  let completed = [];
  let cancelled = [];
  let feedbackPending = [];
  const jobs = await jobModel.find({ customerId: customerId }).populate('babysitterId');
  jobs.forEach(job => {
    if (job.status === 'ongoing') {
      onGoing.push(job);
    } else if (job.status === 'completed') {
      completed.push(job);
      if (!job.reviewed) {
        feedbackPending.push(job);
      }
    } else if (job.status === 'cancelled') {
      cancelled.push(job);
    }
  });
  return {
    onGoing,
    completed,
    cancelled,
    feedbackPending
  };


};

exports.getJobsByBabysitterId = async (babysitterId) => {
  return await jobModel.find({ babysitterId: babysitterId }).populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobCountByBabysitterId = async (babysitterId) => {
  let jobs = await jobModel.find({ babysitterId: babysitterId });
  let availableJobs = jobs.filter(job => job.status === 'available');
  let ongoingJobs = jobs.filter(job => job.status === 'ongoing');
  let completedJobs = jobs.filter(job => job.status === 'completed');
  console.log(jobs);
  console.log(availableJobs);
  console.log(ongoingJobs);
  console.log(completedJobs);
  return {
    availableJobs: availableJobs.length,
    ongoingJobs: ongoingJobs.length,
    completedJobs: completedJobs.length
  };
};

exports.getPostedJobs = async (customerId) => {
  const jobs = await jobModel.find({isFulltime: true}).populate('babysitterId');
  return jobs;
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