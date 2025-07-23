const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const auth = require('../middleware/auth');

router.post('/', auth, cardController.create);
router.get('/', auth, cardController.getByUser);
router.patch('/:id', auth, cardController.update);
router.delete('/:id', auth, cardController.delete);

module.exports = router; 