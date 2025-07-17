const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.create);
router.get('/:chatId', messageController.getByChat);

module.exports = router; 