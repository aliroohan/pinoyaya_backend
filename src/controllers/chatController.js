const chatService = require('../services/chat');

exports.create = async (req, res) => {
    try {
        const user = req.user;
        const { customerId, babysitterId } = req.body;

        const chat = await chatService.createChat({ customerId, babysitterId, user });
        res.status(201).json({ message: 'Chat created successfully', data: chat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getChats = async (req, res) => {
    const user = req.user;
    const chat = await chatService.getChatsById(user);
    res.status(200).json(chat);
}