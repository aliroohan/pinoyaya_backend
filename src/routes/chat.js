const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.create);
router.get('/:id', chatController.getById);

module.exports = router; 