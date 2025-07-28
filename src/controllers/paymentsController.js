const paymentsService = require('../services/payments');

exports.create = async (req, res) => {
  try {
    const payment = await paymentsService.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const payments = await paymentsService.getByCustomer(req.params.customerId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByJob = async (req, res) => {
  try {
    const payments = await paymentsService.getByJob(req.params.jobId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payment = await paymentsService.update(req.params.id, req.body);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 