const Chat = require('../models/Chat');
const Customer = require('../models/Customer');

exports.createChat = async ({ customerId, babysitterId, user = null }) => {
    if (user.type === 'customer') {
        if (user.availableChats > 0) {
            const chat = new Chat({ customerId, babysitterId });
            await chat.save();
            const customer = await Customer.findById(customerId);
            customer.availableChats--;
            await customer.save();
            return chat;
        } else {
            throw new Error('No available chats');
        }
    } else {
        const chat = new Chat({ customerId, babysitterId });
        await chat.save();
        return chat;
    }
}

exports.getChatsById = async (user) => {
    if (user.type === 'customer') {
        const chats = await Chat.find({ customerId: user.id });
        return chats;
    } else {
        const chats = await Chat.find({ babysitterId: user.id });
        return chats;
    }
}

