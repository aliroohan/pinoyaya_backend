const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.create);
router.get('/babysitter/:babysitterId', reviewController.getByBabysitter);
router.get('/customer/:customerId', reviewController.getByCustomer);
router.delete('/:id', reviewController.delete);

module.exports = router; 