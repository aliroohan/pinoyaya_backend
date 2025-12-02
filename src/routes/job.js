const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/',auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/postedJobs', auth, jobController.getPostedJobs);
router.get('/instantJobs', auth, jobController.getInstantJobs);
router.post('/hire', auth, jobController.hireBabysitter);
router.get('/customer/:customerId', auth, jobController.getJobsByCustomerId);
router.get('/babysitter/:babysitterId', auth, jobController.getJobsByBabysitterId);
router.post('/:id/complete', auth, jobController.completeJob);
router.get('/:id', auth, jobController.getJobById);
router.patch('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router; 