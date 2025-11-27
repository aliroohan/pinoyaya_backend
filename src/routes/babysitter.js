const express = require('express');
const router = express.Router();
const babysitterController = require('../controllers/babysitterController');
const auth = require('../middleware/auth');
const {adminAuth} = require('../middleware/adminAuth');

router.post('/signup', babysitterController.signup);
router.post('/login', babysitterController.login);
router.patch('/profession', auth, babysitterController.updateProfession);
router.post('/verify/email', babysitterController.verifyEmail);
router.post('/resend/email', babysitterController.resendEmail);
router.post('/resetpassword', babysitterController.resetPassword);
router.post('/forgetpassword', babysitterController.forgetPassword);
router.post('/uploadimages', auth, babysitterController.uploadImages);
router.get('/filter', auth, babysitterController.getBabysittersByFilter);
router.get('/', auth, babysitterController.getAll);
router.get('/type/:type', auth, babysitterController.getBabysittersByType);
router.get('/:id', auth, babysitterController.getById);
router.patch('/:id', auth, babysitterController.update);
router.delete('/:id', auth, babysitterController.delete);
router.patch('/verifydocs', adminAuth, babysitterController.verifyDocs);

module.exports = router; 