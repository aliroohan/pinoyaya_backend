const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/', cardController.create);
router.get('/:userId', cardController.getByUser);
router.patch('/:id', cardController.update);
router.delete('/:id', cardController.delete);

module.exports = router; 