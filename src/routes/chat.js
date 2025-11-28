const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const {adminAuth, checkRole} = require('../middleware/adminAuth');
router.post('/', auth, chatController.create);
router.get('/', auth, chatController.getChats);
router.get('/all', adminAuth, checkRole(['admin', 'reports']), chatController.getAllChats);

module.exports = router; 