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

exports.getByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const transactions = await transactionsService.getTransactionsByCustomer(customerId);
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBabysitterPayment = async (req, res) => {
  try {
    const { babysitterId } = req.params;
    const transactions = await transactionsService.getTransactionsByBabysitter(babysitterId);
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const transactions = await transactionsService.getTransactionsByJob(jobId);
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionsService.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({
      success: true,
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuccessful = async (req, res) => {
  try {
    const filters = req.query;
    const transactions = await transactionsService.getSuccessfulTransactions(filters);
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFailed = async (req, res) => {
  try {
    const filters = req.query;
    const transactions = await transactionsService.getFailedTransactions(filters);
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 