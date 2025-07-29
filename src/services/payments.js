const payment = require('../models/payment');
const wallet = require('../models/wallet');

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
   const payment = await payment.findById(id);
    if (data.isPaid) {
      let wallet = await wallet.findOne({ babysitter: payment.babysitter });
      if (!wallet) {
        wallet = await wallet.create({ babysitter: payment.babysitter, balance: 0 });
      }
      wallet.balance += payment.total;
      await wallet.save();
    }
    return await payment.findByIdAndUpdate(id, data, { new: true });
};