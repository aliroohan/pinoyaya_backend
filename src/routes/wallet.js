const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');

router.get('/:babysitterId', auth, walletController.getByBabysitter);
router.patch('/:id', auth, walletController.update);

module.exports = router; 