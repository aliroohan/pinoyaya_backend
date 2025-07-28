const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.get('/', subscriptionController.getSubscriptions);
router.post('/', subscriptionController.createSubscription);
router.post('/:id', subscriptionController.subscribe);

module.exports = router; 