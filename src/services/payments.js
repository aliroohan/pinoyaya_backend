const payment = require('../models/payment');

exports.create = async (data) => {
  const payment = new payment(data);
  return await payment.save();
};

exports.getByCustomer = async (customerId) => {
  return await payment.find({ customer: customerId });
};

exports.getByJob = async (jobId) => {
  return await payment.find({ job: jobId });
};

exports.update = async (id, data) => {
    return await payment.findByIdAndUpdate(id, data, { new: true });
}; 