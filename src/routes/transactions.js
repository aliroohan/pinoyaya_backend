const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

router.post('/', transactionsController.create);
router.get('/babysitter/:babysitterId', transactionsController.getByBabysitter);
router.get('/account/:accountId', transactionsController.getByAccount);

module.exports = router; 