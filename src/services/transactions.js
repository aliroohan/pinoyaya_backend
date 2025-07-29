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