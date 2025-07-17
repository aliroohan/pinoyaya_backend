const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        // Allow login by email or phone
        const customer = await Customer.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: customer._id,
            email: customer.email,
            phone: customer.phone
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, customer: payload });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signup = (req, res) => res.send('Customer signup');
exports.verifyPhone = (req, res) => res.send('Customer verify phone');
exports.childAndPets = (req, res) => res.send('Customer add child and pets');
exports.uploadImages = (req, res) => res.send('Customer upload images');
exports.resendOtp = (req, res) => res.send('Customer resend OTP');
exports.resetPassword = (req, res) => res.send('Customer reset password');
exports.forgetPassword = (req, res) => res.send('Customer forget password');
exports.getAll = (req, res) => res.send('Get all customers');
exports.getById = (req, res) => res.send('Get customer by id');
exports.update = (req, res) => res.send('Update customer');
exports.delete = (req, res) => res.send('Delete customer');
exports.verifyDocs = (req, res) => res.send('Customer verify docs'); 