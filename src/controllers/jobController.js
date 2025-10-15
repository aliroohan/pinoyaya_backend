const jobService = require('../services/job');

exports.createJob = async (req, res) => {
  try {
    const customerId = req.user._id;
    const job = await jobService.createJob({ customerId, ...req.body });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobsByFilter = async (req, res) => {
  try {
    const { location, radius, available }  =  req.query;
    const jobs = await jobService.getJobsByFilter(location, radius, available);
    res.json(jobs);
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
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 