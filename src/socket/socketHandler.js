const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const CustomerModel = require('../models/customer');
const BabysitterModel = require('../models/babysitter');
const Chat = require('../models/chat');
const { uploadImage } = require('../services/s3Service');

const connectedUsers = new Map(); 

const socketHandler = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userRole = decoded.profession ? 'babysitter' : 'customer';
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.userId} (${socket.userRole}) ${Date().toLocaleString()}`);
        
        // Store user connection
        connectedUsers.set(socket.userId, {
            socketId: socket.id,
            role: socket.userRole,
            userId: socket.userId
        });
        if (socket.userRole === 'customer') {
            await CustomerModel.findByIdAndUpdate(socket.userId, {isOnline: true})   
        } else {
            await BabysitterModel.findByIdAndUpdate(socket.userId, {isOnline: true})
        }

        // Join user to their personal room
        socket.join(socket.userId);

        // Handle private messages
        socket.on('send_message', async (data) => {
            try {
                const { recipientId, content, messageType = 'text', chatId } = data;
                if (!recipientId || !content) {
                    socket.emit('error', { message: 'Recipient ID and content are required' });
                    return;
                }

                // Create message in database
                const message = new Message({
                    senderId: socket.userId,
                    senderRole: socket.userRole,
                    recipientId: recipientId,
                    recipientRole: socket.userRole === 'customer' ? 'babysitter' : 'customer',
                    content: content,
                    messageType: messageType,
                    timestamp: new Date(),
                    chatId: chatId
                });

                await message.save();
                const chat = await Chat.findByIdAndUpdate(chatId, {lastMessageId: message._id});
                const lastMessage = await Message.findById(message._id).populate('senderId', 'firstName lastName');
                // Emit to recipient if online
                
                const recipientSocket = connectedUsers.get(recipientId);
                if (recipientSocket) {
                    io.to(recipientSocket.socketId).emit('receive_message', {
                        messageId: message._id,
                        senderId: socket.userId,
                        senderRole: socket.userRole,
                        content: content,
                        messageType: messageType,
                        timestamp: message.timestamp
                    });

                    io.to(recipientSocket.socketId).emit('notification', {
                        chatId: chatId,
                        senderId: socket.userId,
                        name: lastMessage.senderId.firstName + ' ' + lastMessage.senderId.lastName,
                        content: content,
                        messageType: messageType,
                        timestamp: message.timestamp                        
                    })
                }

                // Emit back to sender for confirmation
                socket.emit('message_sent', {
                    messageId: message._id,
                    timestamp: message.timestamp
                });

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle image messages
        socket.on('send_image', async (data) => {
            try {
                const { recipientId, imageData, fileName, mimeType, chatId } = data;
                
                if (!recipientId || !imageData) {
                    socket.emit('error', { message: 'Recipient ID and image data are required' });
                    return;
                }
                console.log(data)
                // Convert base64 to buffer
                const buffer = Buffer.from(imageData.split(',')[1], 'base64');
                
                // Upload image to S3
                const imageUrl = await uploadImage(buffer, fileName || 'image.jpg', mimeType || 'image/jpeg');

                // Create message in database
                const message = new Message({
                    senderId: socket.userId,
                    senderRole: socket.userRole,
                    recipientId: recipientId,
                    recipientRole: socket.userRole === 'customer' ? 'babysitter' : 'customer',
                    content: imageUrl,
                    messageType: 'image',
                    timestamp: new Date(),
                    chatId: chatId
                });

                await message.save();

                // Emit to recipient if online
                const recipientSocket = connectedUsers.get(recipientId);
                if (recipientSocket) {
                    io.to(recipientSocket.socketId).emit('receive_message', {
                        messageId: message._id,
                        senderId: socket.userId,
                        senderRole: socket.userRole,
                        content: imageUrl,
                        messageType: 'image',
                        timestamp: message.timestamp,
                        chatId: chatId
                    });
                }

                // Emit back to sender for confirmation
                socket.emit('message_sent', {
                    messageId: message._id,
                    timestamp: message.timestamp,
                    imageUrl: imageUrl,
                    chatId: chatId
                });

            } catch (error) {
                console.error('Error sending image message:', error);
                socket.emit('error', { message: 'Failed to send image message' });
            }
        });

        // Handle typing indicators
        socket.on('typing_start', (data) => {
            const { recipientId } = data;
            const recipientSocket = connectedUsers.get(recipientId);
            if (recipientSocket) {
                io.to(recipientSocket.socketId).emit('user_typing', {
                    userId: socket.userId,
                    userRole: socket.userRole
                });
            }
        });

        socket.on('typing_stop', (data) => {
            const { recipientId } = data;
            const recipientSocket = connectedUsers.get(recipientId);
            if (recipientSocket) {
                io.to(recipientSocket.socketId).emit('user_stopped_typing', {
                    userId: socket.userId,
                    userRole: socket.userRole
                });
            }
        });

        // Handle read receipts
        socket.on('mark_read', async (data) => {
            try {
                console.log(data);
                const { messageId } = data;
                let message;
                if (messageId) {
                    message = await Message.findByIdAndUpdate(messageId, { isRead: true });
                }
                

                // Notify sender that message was read
                
                const chat = await Message.find({ chatId: message.chatId });
                
                if (chat) {
                    const senderSocket = connectedUsers.get(message.senderId.toString());
                    if (senderSocket) {
                        io.to(senderSocket.socketId).emit('message_read', {
                            messageId: messageId,
                            senderId: message.senderId,
                            chat: chat,
                            readBy: socket.userId,
                            readAt: new Date()
                        });
                    }
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        socket.on('mark_read_complete_chat', async (data) => {
            try {
                const { chatId } = data;
                console.log(chatId)
                await Message.updateMany({ chatId, senderId: data.otherUserId }, { isRead: true });
                const chat = await Message.find({ chatId: chatId });
                
                const senderSocket = connectedUsers.get(data.otherUserId);
                if (senderSocket) {
                    io.to(senderSocket.socketId).emit('message_read_complete_chat', {
                        chatId: chatId,
                        readBy: socket.userId,
                        chat: chat,
                        readAt: new Date()
                    });
                }
            } catch (error) {
                console.error('Error marking chat as read:', error);
            }
        });

        // Handle online status
        socket.on('set_online_status', async (data) => {
            try {
                const { isOnline } = data;
                const Model = socket.userRole === 'babysitter' ? BabysitterModel : CustomerModel;
                await Model.findByIdAndUpdate(socket.userId, { isOnline });
                
                // Broadcast online status to relevant users
                socket.broadcast.emit('user_status_changed', {
                    userId: socket.userId,
                    userRole: socket.userRole,
                    isOnline
                });
            } catch (error) {
                console.error('Error updating online status:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.userId}`);
            
            // Remove from connected users
            connectedUsers.delete(socket.userId);
            
            // Update online status in database
            try {
                const Model = socket.userRole === 'babysitter' ? BabysitterModel : CustomerModel;
                await Model.findByIdAndUpdate(socket.userId, { isOnline: false });
                
                // Broadcast offline status
                socket.broadcast.emit('user_status_changed', {
                    userId: socket.userId,
                    userRole: socket.userRole,
                    isOnline: false
                });
            } catch (error) {
                console.error('Error updating offline status:', error);
            }
        });
    });

    // Helper function to get online users
    const getOnlineUsers = () => {
        return Array.from(connectedUsers.values());
    };

    // Make io available for other modules
    global.io = io;
    global.getOnlineUsers = getOnlineUsers;
};

module.exports = socketHandler; 