const messageService = require('../services/message');
const { uploadImage } = require('../services/s3Service');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

exports.getConversationByChatId = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await messageService.getConversationByChatId(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.profession ? 'babysitter' : 'customer';
        
        const conversations = await messageService.getUserConversations(userId, userRole);
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        const messages = await messageService.getConversation(
            req.user._id, 
            otherUserId, 
            parseInt(page), 
            parseInt(limit)
        );
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content, messageType = 'text', chatId } = req.body;
        
        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required' });
        }

        if (messageType === 'text' && !content) {
            return res.status(400).json({ message: 'Content is required for text messages' });
        }

        const messageData = {
            senderId: req.user._id,
            senderRole: req.user.profession ? 'babysitter' : 'customer',
            recipientId: recipientId,
            recipientRole: req.user.profession ? 'customer' : 'babysitter',
            content: content,
            messageType: messageType,
            timestamp: new Date(),
            chatId: chatId
        };

        const message = await messageService.createMessage(messageData);

        // Emit to recipient if online via Socket.IO
        if (global.io) {
            const recipientSocket = global.getOnlineUsers().find(user => user.userId === recipientId);
            if (recipientSocket) {
                global.io.to(recipientSocket.socketId).emit('receive_message', {
                    messageId: message._id,
                    senderId: req.user._id,
                    senderRole: messageData.senderRole,
                    content: content,
                    messageType: messageType,
                    timestamp: message.timestamp,
                    chatId: chatId
                });
            }
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New endpoint for sending image messages
exports.sendImageMessage = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { recipientId, chatId } = req.body;
            
            if (!recipientId) {
                return res.status(400).json({ message: 'Recipient ID is required' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Image file is required' });
            }

            // Upload image to S3
            const imageUrl = await uploadImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            const messageData = {
                senderId: req.user._id,
                senderRole: req.user.profession ? 'babysitter' : 'customer',
                recipientId: recipientId,
                recipientRole: req.user.profession ? 'customer' : 'babysitter',
                content: imageUrl,
                messageType: 'image',
                timestamp: new Date(),
                chatId: chatId
            };

            const message = await messageService.createMessage(messageData);

            // Emit to recipient if online via Socket.IO
            if (global.io) {
                const recipientSocket = global.getOnlineUsers().find(user => user.userId === recipientId);
                if (recipientSocket) {
                    global.io.to(recipientSocket.socketId).emit('receive_message', {
                        messageId: message._id,
                        senderId: req.user._id,
                        senderRole: messageData.senderRole,
                        content: imageUrl,
                        messageType: 'image',
                        timestamp: message.timestamp,
                        chatId: chatId
                    });
                }
            }

            res.status(201).json({
                ...message.toObject(),
                imageUrl: imageUrl
            });
        } catch (error) {
            console.error('Error sending image message:', error);
            res.status(500).json({ message: error.message });
        }
    }
];

exports.markAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const userId = req.user._id;
        
        const result = await messageService.markMessagesAsRead(userId, senderId);
        
        // Notify sender via Socket.IO if online
        if (global.io) {
            const senderSocket = global.getOnlineUsers().find(user => user.userId === senderId);
            if (senderSocket) {
                global.io.to(senderSocket.socketId).emit('messages_read', {
                    readBy: userId,
                    readAt: new Date()
                });
            }
        }
        
        res.status(200).json({ message: 'Messages marked as read', updatedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await messageService.getUnreadCount(userId);
        res.status(200).json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;
        
        const message = await messageService.deleteMessage(messageId, userId);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found or you are not authorized to delete it' });
        }
        
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOnlineUsers = async (req, res) => {
    try {
        const userRole = req.user.profession ? 'babysitter' : 'customer';
        const onlineUsers = await messageService.getOnlineUsers(userRole);
        res.status(200).json(onlineUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 