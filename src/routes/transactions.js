const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const auth = require('../middleware/auth');

router.post('/', auth, transactionsController.create);
router.patch('/:transactionId/success', auth, transactionsController.markSuccess);
router.get('/babysitter/:babysitterId', auth, transactionsController.getByBabysitter);
router.get('/account/:accountId', auth, transactionsController.getByAccount);
router.get('/customer/:customerId', auth, transactionsController.getByCustomer);
router.get('/babysitter-payment/:babysitterId', auth, transactionsController.getByBabysitterPayment);
router.get('/job/:jobId', auth, transactionsController.getByJob);
router.get('/:id', auth, transactionsController.getById);
router.get('/successful', auth, transactionsController.getSuccessful);
router.get('/failed', auth, transactionsController.getFailed);

module.exports = router; 