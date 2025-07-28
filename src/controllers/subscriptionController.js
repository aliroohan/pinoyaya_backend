const subscriptionService = require('../services/subscription');

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user._id 
    const subscriptionId = req.params.id;
    const subscription = await subscriptionService.subscribe(userId, subscriptionId);
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { title, chats, price } = req.body;
    const subscription = await subscriptionService.createSubscription({ title, chats, price });
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}