const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/auth');

router.post('/', auth, addressController.create);
router.get('/:userid', auth, addressController.getByUser);
router.patch('/default/:id', auth, addressController.updateDefault);
router.patch('/:id', auth, addressController.update);
router.delete('/:id', auth, addressController.delete);

module.exports = router; 