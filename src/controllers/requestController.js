const requestService = require('../services/request');

exports.create = async (req, res) => {
  try {
    const request = await requestService.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByJob = async (req, res) => {
  try {
    const requests = await requestService.getByJob(req.params.jobId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const requests = await requestService.getByCustomer(req.params.customerId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBabysitter = async (req, res) => {
  try {
    const requests = await requestService.getByBabysitter(req.params.babysitterId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const request = await requestService.update(req.params.id, req.body);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const request = await requestService.delete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 