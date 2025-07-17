const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');

router.get('/', childController.getAll);
router.patch('/:id', childController.update);
router.delete('/:id', childController.delete);

module.exports = router; 