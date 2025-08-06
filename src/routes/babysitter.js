const express = require('express');
const router = express.Router();
const babysitterController = require('../controllers/babysitterController');
const auth = require('../middleware/auth');

router.post('/signup', babysitterController.signup);
router.post('/login', babysitterController.login);
router.post('/verify/phone/:id', babysitterController.verifyPhone);
// router.post('/verify/email/:id', babysitterController.verifyEmail);
router.post('/resendotp', babysitterController.resendOtp);
router.post('/resetpassword', babysitterController.resetPassword);
router.post('/forgetpassword', babysitterController.forgetPassword);
router.post('/uploadimages', auth, babysitterController.uploadImages);
router.get('/filter', auth, babysitterController.getBabysittersByFilter);
router.get('/', auth, babysitterController.getAll);
router.get('/:id', auth, babysitterController.getById);
router.patch('/:id', auth, babysitterController.update);
router.delete('/:id', auth, babysitterController.delete);
router.patch('/verifydocs', auth, babysitterController.verifyDocs);

module.exports = router; 