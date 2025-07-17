const express = require('express');
const router = express.Router();
const favouritesController = require('../controllers/favouritesController');

router.post('/:id', favouritesController.add);
router.get('/customer/:customerId', favouritesController.getByCustomer);
router.delete('/:id', favouritesController.delete);

module.exports = router; 