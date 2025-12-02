const transactionModel = require('../models/transaction');

exports.create = async (data) => {
  const { details, ...rest } = data;
  const transaction = new transactionModel({
    ...rest,
    details: details ? JSON.stringify(details) : undefined
  });
  return await transaction.save();
};

exports.markSuccess = async (transactionId, details) => {
  return await transactionModel.findByIdAndUpdate(
    transactionId,
    { isSuccessful: true, details: details ? JSON.stringify(details) : undefined },
    { new: true }
  );
};

exports.getByBabysitter = async (babysitterId) => {
  return await transactionModel.find({ babysitterId: babysitterId });
};

exports.getByAccount = async (accountId) => {
  return await transactionModel.find({ accountId: accountId });
};

// New payment transaction functions
exports.createTransaction = async (transactionData) => {
  const transaction = new transactionModel(transactionData);
  return await transaction.save();
};

exports.getTransactionsByCustomer = async (customerId) => {
  return await transactionModel.find({ customerId })
    .populate('paymentId')
    .populate('jobId')
    .populate('cardId')
    .sort({ createdAt: -1 });
};

exports.getTransactionsByBabysitter = async (babysitterId) => {
  return await transactionModel.find({ babysitterId })
    .populate('paymentId')
    .populate('jobId')
    .populate('cardId')
    .sort({ createdAt: -1 });
};

exports.getTransactionsByJob = async (jobId) => {
  return await transactionModel.find({ jobId })
    .populate('paymentId')
    .populate('customerId')
    .populate('babysitterId')
    .populate('cardId')
    .sort({ createdAt: -1 });
};

exports.getTransactionById = async (transactionId) => {
  return await transactionModel.findById(transactionId)
    .populate('paymentId')
    .populate('jobId')
    .populate('customerId')
    .populate('babysitterId')
    .populate('cardId');
};

exports.getSuccessfulTransactions = async (filters = {}) => {
  return await transactionModel.find({ 
    isSuccessful: true,
    ...filters 
  })
    .populate('paymentId')
    .populate('jobId')
    .populate('cardId')
    .sort({ createdAt: -1 });
};

exports.getFailedTransactions = async (filters = {}) => {
  return await transactionModel.find({ 
    isSuccessful: false,
    ...filters 
  })
    .populate('paymentId')
    .populate('jobId')
    .populate('cardId')
    .sort({ createdAt: -1 });
};

exports.updateTransactionStatus = async (transactionId, status, additionalData = {}) => {
  return await transactionModel.findByIdAndUpdate(
    transactionId,
    { 
      status,
      isSuccessful: status === 'succeeded',
      ...additionalData
    },
    { new: true }
  );
}; 