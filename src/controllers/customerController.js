const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { VerificationCode } = require('../services/Twilio');
const { createCustomer } = require('../services/customer');

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
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
exports.signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ email: email || null, phone: phone || null });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const customer = await createCustomer({ firstName, lastName, email, phone, password, phoneVerificationCode });
        const twilioResponse = await VerificationCode(customer);
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
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