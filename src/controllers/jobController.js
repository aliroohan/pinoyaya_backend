const jobService = require('../services/job');
const requestService = require('../services/request');


exports.createJob = async (req, res) => {
  try {
    const customerId = req.user._id;
    const job = await jobService.createJob({ customerId, ...req.body });
    res.status(201).json({status: "success", data: job});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobs();
    res.json({status: "success", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.hireBabysitter = async (req, res) => {
  try {
    const customerId = req.user._id;
    const job = await jobService.createJob({ ...req.body, customerId, status: "waiting" });
    const request = await requestService.create({ jobId: job._id, customerId, babysitterId: req.body.babysitterId, status: "pending", createdby: "customer" }, req.user);
    if (!job) return res.status(400).json({ error: 'Failed to create job' });
    if (!request) return res.status(400).json({ error: 'Failed to create request' });
    res.status(201).json({status: "success", data: { job, request }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPostedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getPostedJobs();
    res.json({status: "success", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstantJobs = async (req, res) => {
  try {
    const jobs = await jobService.getInstantJobs();
    res.json({status: "success", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getJobsByFilter = async (req, res) => {
  try {
    const { location, radius, available }  =  req.query;
    const jobs = await jobService.getJobsByFilter(location, radius, available);
    res.json({status: "success", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobsByCustomerId = async (req, res) => {
  try {
    const jobs = await jobService.getJobsByCustomerId(req.params.customerId);
    res.json({message: "Jobs fetched successfully", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobsByBabysitterId = async (req, res) => {
  try {
    const jobs = await jobService.getJobsByBabysitterId(req.params.babysitterId);
    res.json({message: "Jobs fetched successfully", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({status: "success", data: job});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({status: "success", data: job});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ status: "success", message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeJob = async (req, res) => {
  try {
    const job = await jobService.completeJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ status: "success", message: 'Job completed successfully', data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.getUnapprovedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getUnapprovedJobs();
    res.json({message: "Jobs fetched successfully", data: jobs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
