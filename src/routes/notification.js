const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.post('/', notificationController.create);
router.get('/', auth, notificationController.getByUser);
router.delete('/:id', auth, notificationController.delete);

module.exports = router; 