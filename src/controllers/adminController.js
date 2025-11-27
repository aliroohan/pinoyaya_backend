const adminService = require('../services/admin');
const mailService = require('../services/mail');
const jwt = require('jsonwebtoken');

// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const result = await adminService.login(email, password);
        const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET);
        
        res.json({
            success: true,
            message: 'Admin login successful',
            token:token,
            data:result,
            role: result.admin.role
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Create new admin (requires admin authentication)
exports.createAdmin = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, role } = req.body;
        
        if (!name || !email || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (role !== "reports" && role !== "financials" && role !== "jobReviewer") {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const admin = await adminService.createAdmin({ name, email, role });
        console.log(admin);
        const mailResponse = await mailService.sendPasswordSettingMail(admin.email, admin._id, admin.name);
        console.log(mailResponse);
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: admin,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get admin profile
exports.getProfile = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.admin._id);
        
        res.json({
            success: true,
            data:admin
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        
        res.json({
            success: true,
            data:admins,
            count: admins.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);
        
        res.json({
            success: true,
            data:admin
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updateData = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        
        const admin = await adminService.updateAdmin(req.params.id, updateData);
        
        res.json({
            success: true,
            message: 'Admin updated successfully',
            data:admin
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        await adminService.deleteAdmin(req.params.id);
        
        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        
        await adminService.changePassword(req.admin._id, currentPassword, newPassword);
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 

exports.setPassword = async (req, res) => {
    try {
        const { id, password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        await adminService.setPassword(id, password);
        
        res.json({
            success: true,
            message: 'Password set successfully'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};