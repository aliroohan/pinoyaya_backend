const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Get all conversations for the authenticated user
router.get('/conversations', auth, messageController.getConversations);

// Get conversation with a specific user
router.get('/conversation/:otherUserId', auth, messageController.getConversation);

// Send a text message
router.post('/send', auth, messageController.sendMessage);

// Send an image message
router.post('/send-image', auth, messageController.sendImageMessage);

// Mark messages as read from a specific sender
router.patch('/read/:senderId', auth, messageController.markAsRead);

// Get unread message count
router.get('/unread-count', auth, messageController.getUnreadCount);

// Delete a message (only sender can delete)
router.delete('/:messageId', auth, messageController.deleteMessage);

// Search messages
router.get('/search', auth, messageController.searchMessages);

// Get online users (opposite role)
router.get('/online-users', auth, messageController.getOnlineUsers);

module.exports = router; 