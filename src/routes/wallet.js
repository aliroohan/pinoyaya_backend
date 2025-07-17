const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/:babysitterId', walletController.getByBabysitter);
router.patch('/:id', walletController.update);

module.exports = router; 