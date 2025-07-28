const messageService = require('../services/message');

exports.create = async (req, res) => {
  try {
    const message = await messageService.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByChat = async (req, res) => {
  try {
    const messages = await messageService.getByChat(req.params.chatId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 