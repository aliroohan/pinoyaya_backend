const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.create);
router.get('/job/:jobId', requestController.getByJob);
router.get('/customer/:customerId', requestController.getByCustomer);
router.get('/babysitter/:babysitterId', requestController.getByBabysitter);
router.patch('/:id', requestController.update);
router.delete('/:id', requestController.delete);

module.exports = router; 