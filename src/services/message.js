const message = require('../models/message');

exports.create = async (data) => {
  const message = new message(data);
  return await message.save();
};

exports.getByChat = async (chatId) => {
  return await message.find({ chat: chatId });
};

