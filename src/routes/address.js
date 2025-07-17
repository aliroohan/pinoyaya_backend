const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.post('/', addressController.create);
router.get('/:userid', addressController.getByUser);
router.patch('/:id', addressController.update);
router.delete('/:id', addressController.delete);

module.exports = router; 