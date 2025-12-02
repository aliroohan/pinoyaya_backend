const reviewModel = require('../models/review');
const jobModel = require('../models/job');

exports.create = async (data) => {
  const job = await jobModel.findById(data.jobId);
  job.reviewed = true;
  await job.save();

  const review = new reviewModel(data);
  return await review.save();
};

exports.getByBabysitter = async (babysitterId) => {
  return await reviewModel.find({ babysitterId: babysitterId }).populate('customerId');
};

exports.getAverageRatingByBabysitter = async (babysitterId) => {
  const reviews = await reviewModel.find({ babysitterId: babysitterId });
  return reviews.reduce((sum, review) => sum + (review.service + review.communication + review.recommend) / 3, 0) / reviews.length;
};

exports.getByCustomer = async (customerId) => {
  return await reviewModel.find({ customerId: customerId });
};

exports.delete = async (id) => {
  return await reviewModel.findByIdAndDelete(id);
}; 