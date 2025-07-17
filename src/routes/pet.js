const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.get('/', petController.getAll);
router.patch('/:id', petController.update);
router.delete('/:id', petController.delete);

module.exports = router; 