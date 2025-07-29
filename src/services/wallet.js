const wallet = require('../models/wallet');

exports.getByBabysitter = async (babysitterId) => {
  return await wallet.findOne({ babysitter: babysitterId });
};

exports.update = async (id, data) => {
  return await wallet.findByIdAndUpdate(id, data, { new: true });
};