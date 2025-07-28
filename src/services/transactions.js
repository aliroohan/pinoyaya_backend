const transaction = require('../models/transaction');

exports.create = async (data) => {
  const { details, ...rest } = data;
  const transaction = new transaction({
    ...rest,
    details: details ? JSON.stringify(details) : undefined
  });
  return await transaction.save();
};

exports.markSuccess = async (transactionId, details) => {
  return await transaction.findByIdAndUpdate(
    transactionId,
    { isSuccessful: true, details: details ? JSON.stringify(details) : undefined },
    { new: true }
  );
};

exports.getByBabysitter = async (babysitterId) => {
  return await transaction.find({ babysitterId: babysitterId });
};

exports.getByAccount = async (accountId) => {
  return await transaction.find({ accountId: accountId });
}; 