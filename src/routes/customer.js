const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.post('/login', customerController.login);
router.post('/signup', customerController.signup);
router.post('/verify/phone/:id', customerController.verifyPhone);
router.post('/resendotp', customerController.resendOtp);
router.post('/resetpassword', customerController.resetPassword);
router.post('/forgetpassword', customerController.forgetPassword);
router.post('/childandpets', auth, customerController.childAndPets);
router.post('/uploadimages', auth, customerController.uploadImages);
router.get('/', auth, customerController.getAll);
router.get('/:id', auth, customerController.getById);
router.patch('/:id', auth, customerController.update);
router.delete('/:id', auth, customerController.delete);
router.patch('/verifydocs', auth, customerController.verifyDocs);

module.exports = router; 