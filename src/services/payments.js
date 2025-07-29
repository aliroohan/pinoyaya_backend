const paymentModel = require('../models/payment');
const walletModel = require('../models/wallet');

exports.create = async (data) => {
  const payment = new paymentModel(data);
  return await payment.save();
};

exports.getByCustomer = async (customerId) => {
  return await paymentModel.find({ customer: customerId });
};

exports.getByJob = async (jobId) => {
  return await paymentModel.find({ job: jobId });
};

exports.update = async (id, data) => {
   const payment = await paymentModel.findById(id);
    if (data.isPaid) {
      let wallet = await walletModel.findOne({ babysitter: payment.babysitter });
      if (!wallet) {
        wallet = await walletModel.create({ babysitter: payment.babysitter, balance: 0 });
      }
      wallet.balance += payment.total;
      await wallet.save();
    }
    return await paymentModel.findByIdAndUpdate(id, data, { new: true });
};