const walletModel = require('../models/wallet');

exports.getByBabysitter = async (babysitterId) => {
  return await walletModel.findOne({ babysitter: babysitterId });
};

exports.update = async (id, data) => {
  return await walletModel.findByIdAndUpdate(id, data, { new: true });
};