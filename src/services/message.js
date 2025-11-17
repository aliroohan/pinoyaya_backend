const Message = require('../models/message');
const CustomerModel = require('../models/customer');
const BabysitterModel = require('../models/babysitter');

exports.createMessage = async (messageData) => {
    try {
        const message = new Message(messageData);
        return await message.save();
    } catch (error) {
        throw new Error(`Failed to create message: ${error.message}`);
    }
};

exports.getConversation = async (userId1, userId2, page = 1, limit = 50) => {
    try {
        const skip = (page - 1) * limit;
        
        const messages = await Message.find({
            $or: [
                { senderId: userId1, recipientId: userId2 },
                { senderId: userId2, recipientId: userId1 }
            ]
        })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'firstName lastName email phone')
        .populate('recipientId', 'firstName lastName email phone');

        return messages.reverse(); // Return in chronological order
    } catch (error) {
        throw new Error(`Failed to get conversation: ${error.message}`);
    }
};

exports.getConversationByChatId = async (chatId) => {
    try {
        const messages = await Message.find({ chatId: chatId }).sort({ timestamp: 1 });
        return messages;
    } catch (error) {
        throw new Error(`Failed to get conversation by chat id: ${error.message}`);
    }
};
exports.getUserConversations = async (userId, userRole) => {
    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { recipientId: userId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$senderId', userId] },
                            '$recipientId',
                            '$senderId'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$recipientId', userId] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { 'lastMessage.timestamp': -1 }
            }
        ]);

        // Populate user details for each conversation
        const populatedConversations = await Promise.all(
            conversations.map(async (conv) => {
                const otherUserId = conv._id;
                const otherUser = userRole === 'customer' 
                    ? await BabysitterModel.findById(otherUserId).select('firstName lastName email phone isOnline')
                    : await CustomerModel.findById(otherUserId).select('firstName lastName email phone isOnline');
                
                return {
                    ...conv,
                    otherUser: otherUser || { _id: otherUserId, firstName: 'Unknown', lastName: 'User' }
                };
            })
        );

        return populatedConversations;
    } catch (error) {
        throw new Error(`Failed to get user conversations: ${error.message}`);
    }
};

exports.markMessagesAsRead = async (userId, senderId) => {
    try {
        const result = await Message.updateMany(
            {
                senderId: senderId,
                recipientId: userId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );
        return result;
    } catch (error) {
        throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
};

exports.getUnreadCount = async (userId) => {
    try {
        const count = await Message.countDocuments({
            recipientId: userId,
            isRead: false
        });
        return count;
    } catch (error) {
        throw new Error(`Failed to get unread count: ${error.message}`);
    }
};

exports.deleteMessage = async (messageId, userId) => {
    try {
        const message = await Message.findOneAndDelete({
            _id: messageId,
            senderId: userId
        });
        return message;
    } catch (error) {
        throw new Error(`Failed to delete message: ${error.message}`);
    }
};


exports.getOnlineUsers = async (userRole) => {
    try {
        const Model = userRole === 'babysitter' ? CustomerModel : BabysitterModel;
        const onlineUsers = await Model.find({ isOnline: true })
            .select('_id firstName lastName email phone isOnline')
            .sort({ firstName: 1 });
        return onlineUsers;
    } catch (error) {
        throw new Error(`Failed to get online users: ${error.message}`);
    }
};

