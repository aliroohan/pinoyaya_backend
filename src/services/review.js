const review = require('../models/review');

exports.create = async (data) => {
  const review = new review(data);
  return await review.save();
};

exports.getByBabysitter = async (babysitterId) => {
  return await review.find({ babysitter: babysitterId });
};

exports.getByCustomer = async (customerId) => {
  return await review.find({ customer: customerId });
};

exports.delete = async (id) => {
  return await review.findByIdAndDelete(id);
}; 