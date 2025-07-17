const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.create);
router.get('/:userId', notificationController.getByUser);
router.delete('/:id', notificationController.delete);

module.exports = router; 