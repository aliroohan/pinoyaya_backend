const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, reviewController.create);
router.get('/babysitter/:babysitterId', reviewController.getByBabysitter);
router.get('/customer/:customerId', reviewController.getByCustomer);
router.delete('/:id', auth, reviewController.delete);

module.exports = router; 