const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

router.post('/', auth, locationController.create);
router.get('/:userid', auth, locationController.getByUser);
router.patch('/default/:id', auth, locationController.updateDefault);
router.patch('/:id', auth, locationController.update);
router.delete('/:id', auth, locationController.delete);

module.exports = router; 