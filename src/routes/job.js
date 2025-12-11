const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const {adminAuth}    = require('../middleware/adminAuth');

router.post('/',auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/getUnapprovedJobs', adminAuth, jobController.getUnapprovedJobs);
router.get('/postedJobs', auth, jobController.getPostedJobs);
router.get('/instantJobs', auth, jobController.getInstantJobs);
router.post('/hire', auth, jobController.hireBabysitter);
router.get('/customer/:customerId', auth, jobController.getJobsByCustomerId);
router.get('/babysitter/:babysitterId', auth, jobController.getJobsByBabysitterId);
router.post('/:id/complete', auth, jobController.completeJob);
router.get('/:id', auth, jobController.getJobById);
router.patch('/approve/:id', adminAuth, jobController.approveJob);
router.patch('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router; 