const chatModel = require("../models/chat");

exports.createChat = async ({ customerId, babysitterId, user = null }) => {
    const existingChat = await chatModel.findOne({ customerId, babysitterId });
    if (existingChat) {
        return existingChat;
    }
    const chat = new chatModel({ customerId, babysitterId });
    await chat.save();
    return chat;
};

exports.getChatsById = async (user) => {
    if (user.type === "customer") {
        const chats = await chatModel.find({ customerId: user.id }).populate("babysitterId").populate("lastMessageId").sort({ updatedAt: -1 });
        return chats;
    } else {
        const chats = await chatModel.find({ babysitterId: user.id }).populate("customerId").populate("lastMessageId").sort({ updatedAt: -1 });
        return chats;
    }
};
