const messageModel = require('../models/message');

exports.create = async (data) => {
  const message = new messageModel(data);
  return await message.save();
};

exports.getByChat = async (chatId) => {
  return await messageModel.find({ chat: chatId });
};

