const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');
const auth = require('../middleware/auth');

router.post('/', auth, certificatesController.create);
router.post('/addMultiple', auth, certificatesController.addMultiple);
router.get('/babysitter/:babysitterId', certificatesController.getByBabysitter);
router.delete('/:id', certificatesController.delete);

module.exports = router; 