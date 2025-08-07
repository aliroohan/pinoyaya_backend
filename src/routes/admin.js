const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public routes (no authentication required)
router.post('/login', adminController.login);

// Protected routes (require admin authentication)
router.post('/create', adminAuth, adminController.createAdmin);
router.get('/profile', adminAuth, adminController.getProfile);
router.get('/', adminAuth, adminController.getAllAdmins);
router.get('/:id', adminAuth, adminController.getAdminById);
router.patch('/:id', adminAuth, adminController.updateAdmin);
router.delete('/:id', adminAuth, adminController.deleteAdmin);
router.patch('/change-password', adminAuth, adminController.changePassword);

module.exports = router; 