const reviewModel = require('../models/review');

exports.create = async (data) => {
  const review = new reviewModel(data);
  return await review.save();
};

exports.getByBabysitter = async (babysitterId) => {
  return await reviewModel.find({ babysitter: babysitterId });
};

exports.getByCustomer = async (customerId) => {
  return await reviewModel.find({ customer: customerId });
};

exports.delete = async (id) => {
  return await reviewModel.findByIdAndDelete(id);
}; 