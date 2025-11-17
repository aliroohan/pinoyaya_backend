const chatModel = require("../models/chat");

exports.createChat = async ({ customerId, babysitterId, user = null }) => {
    const chat = new chatModel({ customerId, babysitterId });
    await chat.save();
    return chat;
};

exports.getChatsById = async (user) => {
    if (user.type === "customer") {
        const chats = await chatModel.find({ customerId: user.id });
        return chats;
    } else {
        const chats = await chatModel.find({ babysitterId: user.id });
        return chats;
    }
};
