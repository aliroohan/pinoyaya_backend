const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/', auth, requestController.create);
router.get('/job/:jobId', auth, requestController.getByJob);
router.post('/babysitter/accept', auth, requestController.babysitterAcceptRequest);
router.post('/babysitter/reject', auth, requestController.babysitterRejectRequest);
router.post('/customer/accept', auth, requestController.customerAcceptRequest);
router.post('/customer/reject', auth, requestController.customerRejectRequest);
router.get('/customer', auth, requestController.getByCustomer);
router.get('/babysitter', auth, requestController.getByBabysitter);
router.patch('/:id', auth, requestController.update);
router.delete('/:id', auth, requestController.delete);

module.exports = router; 