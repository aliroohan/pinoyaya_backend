const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/:package', subscriptionController.subscribe);

module.exports = router; 