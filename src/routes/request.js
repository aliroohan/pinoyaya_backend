const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/', requestController.create);
router.get('/job/:jobId', auth, requestController.getByJob);
router.get('/customer/:customerId', auth, requestController.getByCustomer);
router.get('/babysitter/:babysitterId', auth, requestController.getByBabysitter);
router.patch('/:id', auth, requestController.update);
router.delete('/:id', auth, requestController.delete);

module.exports = router; 