const jobModel = require('../models/job');
const requestModel = require('../models/request');

exports.createJob = async (data) => {
  const job = new jobModel(data);
  return await job.save();
};

exports.getJobs = async () => {
  return await jobModel.find().populate('customerId').populate('babysitterId').populate('childId').populate('location');
};

exports.getJobsByCustomerId = async (customerId) => {
  let pending = [];
  let onGoing = [];
  let completed = [];
  let cancelled = [];
  let feedbackPending = [];
  pending = await requestModel.find({ customerId: customerId, status: 'pending', createdby: 'babysitter' }).populate('jobId').populate('babysitterId');
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
    pending,
    onGoing,
    completed,
    cancelled,
    feedbackPending
  };


};

exports.getJobsByBabysitterId = async (babysitterId) => {
  let pending = []
  let onGoing = []
  let completed = []
  let cancelled = []
  const jobs = await jobModel.find({ babysitterId: babysitterId }).populate('customerId').populate('babysitterId').populate('childId').populate('location');
  pending = await requestModel.find({ babysitterId: babysitterId, status: 'pending', createdby: 'customer' }).populate('jobId').populate('customerId');
  jobs.forEach(job => {
    if (job.status === 'ongoing') {
      onGoing.push(job);
    } else if (job.status === 'completed') {
      completed.push(job);
    } else if (job.status === 'cancelled') {
      cancelled.push(job);
    }
  });
  return {
    pending,
    onGoing,
    completed,
    cancelled
  };

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
  const jobs = await jobModel.find({isFulltime: true, status: 'available'}).populate('babysitterId').populate('customerId');
  return jobs;
};

exports.getInstantJobs = async () => {
  const jobs = await jobModel.find({isFulltime: false, status: 'available'}).populate('babysitterId').populate('customerId');
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