const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const auth = require('../middleware/auth');

router.get('/', auth, childController.getAll);
router.patch('/:id', auth, childController.update);
router.delete('/:id', auth, childController.delete);

module.exports = router; 