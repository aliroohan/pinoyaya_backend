const transactionsService = require('../services/transactions');

exports.create = async (req, res) => {
  try {
    const { details, ...rest } = req.body;
    const transaction = await transactionsService.create({ details, ...rest });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markSuccess = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { details } = req.body;
    const transaction = await transactionsService.markSuccess(transactionId, details);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBabysitter = async (req, res) => {
  try {
    const transactions = await transactionsService.getByBabysitter(req.params.babysitterId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByAccount = async (req, res) => {
  try {
    const transactions = await transactionsService.getByAccount(req.params.accountId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 