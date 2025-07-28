const chat = require('../models/chat');
const customer = require('../models/customer');

exports.createChat = async ({ customerId, babysitterId, user = null }) => {
    if (user.type === 'customer') {
        if (user.availableChats > 0) {
            const chat = new chat({ customerId, babysitterId });
            await chat.save();
            const customer = await customer.findById(customerId);
            customer.availableChats--;
            await customer.save();
            return chat;
        } else {
            throw new Error('No available chats');
        }
    } else {
        const chat = new chat({ customerId, babysitterId });
        await chat.save();
        return chat;
    }
}

exports.getChatsById = async (user) => {
    if (user.type === 'customer') {
        const chats = await chat.find({ customerId: user.id });
        return chats;
    } else {
        const chats = await chat.find({ babysitterId: user.id });
        return chats;
    }
}

