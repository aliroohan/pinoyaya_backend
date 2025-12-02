const express = require('express');
const router = express.Router();
const favouritesController = require('../controllers/favouritesController');
const auth = require('../middleware/auth');

router.post('/', auth, favouritesController.add);
router.get('/', auth, favouritesController.getByCustomer);
router.delete('/:id', auth, favouritesController.delete);

module.exports = router; 