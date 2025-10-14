const reviewService = require('../services/review');

exports.create = async (req, res) => {
  try {
    const review = await reviewService.create(req.body);
    res.status(201).json({ message: 'Review created successfully'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBabysitter = async (req, res) => {
  try {
    const reviews = await reviewService.getByBabysitter(req.params.babysitterId);
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const totalReviews = reviews.length;
    const response = {
      reviews,
      averageRating,
      totalReviews
    };
    res.json({message: 'Reviews fetched successfully', data: response});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const reviews = await reviewService.getByCustomer(req.params.customerId);
    res.json({message: 'Reviews fetched successfully', data: reviews});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const review = await reviewService.delete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 