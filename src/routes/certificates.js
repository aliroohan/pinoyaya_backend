const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');

router.post('/', certificatesController.create);
router.get('/babysitter/:babysitterId', certificatesController.getByBabysitter);
router.delete('/:id', certificatesController.delete);

module.exports = router; 