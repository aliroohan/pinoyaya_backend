const subscriptionModel = require('../models/subscription');
const customerModel = require('../models/customer');

exports.subscribe = async (userId, subscriptionId) => {
  const customer = await customerModel.findById(userId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  const subscription = await subscriptionModel.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  customer.availableChats += subscription.chats;
  return await customer.save();
};

exports.getSubscriptions = async () => {
  return await subscriptionModel.find();
};

exports.createSubscription = async (data) => {
  const subscription = new subscriptionModel(data);
  return await subscription.save();
};