const express = require('express');
const router = express.Router();
const bankaccountController = require('../controllers/bankaccountController');
const auth = require('../middleware/auth');

router.post('/', auth, bankaccountController.create);
router.get('/', auth, bankaccountController.getByBabysitter);
router.patch('/:id', auth, bankaccountController.update);
router.delete('/:id', auth, bankaccountController.delete);

module.exports = router; 