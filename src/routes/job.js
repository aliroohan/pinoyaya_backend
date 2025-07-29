const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/',auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/customer/:customerId', auth, jobController.getJobsByCustomerId);
router.get('/babysitter/:babysitterId', auth, jobController.getJobsByBabysitterId);
router.get('/:id', auth, jobController.getJobById);
router.patch('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router; 