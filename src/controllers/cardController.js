const cardService = require('../services/card');

exports.create = async (req, res) => {
    try {
        const user = req.user;
        let cardData = { paymentMethodId: req.body.paymentMethodId };
        if (user.type === 'customer') {
            cardData.customerId = user._id;
        } else if (user.type === 'babysitter') {
            cardData.babysitterId = user._id;
        } else {
            return res.status(400).json({ error: 'User must be a customer or babysitter' });
        }
        const card = await cardService.createCard(cardData);
        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const user = req.user;
        const cards = await cardService.getCardsByUser(user);
        res.status(200).json({ message: 'Cards fetched successfully', cards });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const user = req.user;
        const card = await cardService.updateCard(req.params.id, { paymentMethodId: req.body.paymentMethodId }, user);
        res.status(200).json({ message: 'Card updated successfully', card });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const user = req.user;
        await cardService.deleteCard(req.params.id, user);
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 