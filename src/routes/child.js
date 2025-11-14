const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const auth = require('../middleware/auth');

router.get('/', auth, childController.getAll);
router.post('/', auth, childController.create);
router.get('/:id', auth, childController.getById);
router.patch('/:id', auth, childController.update);
router.delete('/:id', auth, childController.delete);

module.exports = router; 