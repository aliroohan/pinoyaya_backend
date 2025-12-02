const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const { adminAuth, checkRole } = require('../middleware/adminAuth');

router.get('/conversations', auth, messageController.getConversations); // Get all conversations for the authenticated user
router.get('/conversation/:chatId', auth, messageController.getConversationByChatId); // Get conversation by chat id
router.post('/send', auth, messageController.sendMessage); // Send a text message
router.post('/send-image', auth, messageController.sendImageMessage); // Send an image message
router.patch('/read/:senderId', auth, messageController.markAsRead); // Mark messages as read from a specific sender
router.get('/unread-count', auth, messageController.getUnreadCount); // Get unread message count
router.delete('/:messageId', auth, messageController.deleteMessage); // Delete a message (only sender can delete)
router.get('/online-users', auth, messageController.getOnlineUsers); // Get online users (opposite role) 
router.get('/all/:chatId', adminAuth, checkRole(['admin', 'reports']), messageController.getConversationByChatId);


module.exports = router; 