const requestService = require('../services/request');

exports.create = async (req, res) => {
  try {
    const request = await requestService.create(req.body, req.user);
    res.status(201).json({status: "success", data: request});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByJob = async (req, res) => {
  try {
    const requests = await requestService.getByJob(req.params.jobId);
    res.json({status: "success", data: requests});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const requests = await requestService.getByCustomer(req.user._id);
    res.json({status: "success", data: requests});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

exports.getByBabysitter = async (req, res) => {
  try {
    const requests = await requestService.getByBabysitter(req.user._id);
    res.json({status: "success", data: requests});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const request = await requestService.update(req.params.id, req.body);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({status: "success", data: request});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const request = await requestService.delete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ status: "success", message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 