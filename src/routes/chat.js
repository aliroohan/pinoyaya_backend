const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.post('/', auth, chatController.create);
router.get('/', auth, chatController.getChats);

module.exports = router; 