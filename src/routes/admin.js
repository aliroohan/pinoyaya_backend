const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {adminAuth, checkRole} = require('../middleware/adminAuth');


router.patch('/change-password', adminController.changePassword);
router.patch('/set-password', adminController.setPassword);
router.post('/login', adminController.login);
router.post('/create', adminController.createAdmin);
router.get('/profile', adminAuth, adminController.getProfile);
router.get('/', adminAuth, checkRole('admin'), adminController.getAllAdmins);
router.get('/:id', adminAuth, checkRole('admin'), adminController.getAdminById);
router.patch('/:id', adminAuth, checkRole('admin'), adminController.updateAdmin);
router.delete('/:id', adminAuth, checkRole('admin'), adminController.deleteAdmin);

module.exports = router; 