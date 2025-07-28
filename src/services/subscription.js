const subscription = require('../models/subscription');
const customer = require('../models/customer');

exports.subscribe = async (userId, subscriptionId) => {
  const customer = await customer.findById(userId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  const subscription = await subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  customer.availableChats += subscription.chats;
  return await customer.save();
};

exports.getSubscriptions = async () => {
  return await subscription.find();
};

exports.createSubscription = async (data) => {
  const subscription = new subscription(data);
  return await subscription.save();
};