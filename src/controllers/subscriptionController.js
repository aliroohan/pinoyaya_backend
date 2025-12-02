const subscriptionService = require('../services/subscription');

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user._id 
    const subscriptionId = req.params.id;
    const subscription = await subscriptionService.subscribe(userId, subscriptionId);
    res.status(201).json({status: "success", data: subscription});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    res.status(200).json({status: "success", data: subscriptions});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { title, description, duration, price } = req.body;
    const subscription = await subscriptionService.createSubscription({ title, description, duration, price });
    res.status(201).json({status: "success", data: subscription});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}