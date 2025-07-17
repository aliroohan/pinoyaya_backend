const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/', paymentsController.create);
router.get('/customer/:customerId', paymentsController.getByCustomer);
router.get('/job/:jobId', paymentsController.getByJob);
router.patch('/:id', paymentsController.update);

module.exports = router; 