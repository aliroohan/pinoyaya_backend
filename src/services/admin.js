const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Generate JWT token for admin
const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Admin login
exports.login = async (email, password) => {
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
        throw new Error('Invalid email or password');
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    
    const token = generateToken(admin._id);
    
    return {
        admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone
        },
        token
    };
};

// Create new admin
exports.createAdmin = async (adminData) => {
    const admin = new Admin(adminData);
    await admin.save();
    
    return {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone
    };
};

// Get admin by ID
exports.getAdminById = async (id) => {
    const admin = await Admin.findById(id).select('-password');
    if (!admin) {
        throw new Error('Admin not found');
    }
    return admin;
};

// Get all admins
exports.getAllAdmins = async () => {
    return await Admin.find().select('-password');
};

// Update admin
exports.updateAdmin = async (id, updateData) => {
    const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!admin) {
        throw new Error('Admin not found');
    }
    return admin;
};

// Delete admin
exports.deleteAdmin = async (id) => {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
        throw new Error('Admin not found');
    }
    return admin;
};

// Change admin password
exports.changePassword = async (id, currentPassword, newPassword) => {
    const admin = await Admin.findById(id);
    
    if (!admin) {
        throw new Error('Admin not found');
    }
    
    const isMatch = await admin.comparePassword(currentPassword);
    
    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }
    
    admin.password = newPassword;
    await admin.save();
    
    return { message: 'Password changed successfully' };
}; 