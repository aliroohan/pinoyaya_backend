const Card = require('../models/Card');

exports.createCard = async (cardData) => {
    const card = new Card(cardData);
    await card.save();
    return card;
};

exports.getCardsByUser = async (user) => {
    if (user.type === 'customer') {
        return Card.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        return Card.find({ babysitterId: user._id });
    } else {
        throw new Error('User must be a customer or babysitter');
    }
};

exports.updateCard = async (id, cardData, user) => {
    let query = {};
    if (user.type === 'customer') query.customerId = user._id;
    if (user.type === 'babysitter') query.babysitterId = user._id;
    const card = await Card.findOneAndUpdate({ _id: id, ...query }, cardData, { new: true });
    if (!card) throw new Error('Card not found or not authorized');
    return card;
};

exports.deleteCard = async (id, user) => {
    let query = {};
    if (user.type === 'customer') query.customerId = user._id;
    if (user.type === 'babysitter') query.babysitterId = user._id;
    const card = await Card.findOneAndDelete({ _id: id, ...query });
    if (!card) throw new Error('Card not found or not authorized');
    return card;
};
