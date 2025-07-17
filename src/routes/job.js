const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/filter', jobController.getJobsByFilter);
router.get('/customer/:customerId', jobController.getJobsByCustomerId);
router.get('/babysitter/:babysitterId', jobController.getJobsByBabysitterId);
router.get('/:id', jobController.getJobById);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router; 