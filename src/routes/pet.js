const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middleware/auth')

router.post('/', auth, petController.create);
router.get('/', auth, petController.getAll);
router.patch('/:id', auth, petController.update);
router.delete('/:id', auth,petController.delete);

module.exports = router; 