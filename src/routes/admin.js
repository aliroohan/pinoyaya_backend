const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');


router.post('/login', adminController.login);
router.post('/create', adminController.createAdmin);
router.get('/profile', adminAuth, adminController.getProfile);
router.get('/', adminAuth, adminController.getAllAdmins);
router.get('/:id', adminAuth, adminController.getAdminById);
router.patch('/:id', adminAuth, adminController.updateAdmin);
router.delete('/:id', adminAuth, adminController.deleteAdmin);
router.patch('/change-password', adminAuth, adminController.changePassword);

module.exports = router; 