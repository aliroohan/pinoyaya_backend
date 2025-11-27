const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const {adminAuth} = require('../middleware/adminAuth');

router.get('/', auth, subscriptionController.getSubscriptions);
router.post('/', adminAuth, subscriptionController.createSubscription);
router.post('/:id', auth, subscriptionController.subscribe);

module.exports = router; 