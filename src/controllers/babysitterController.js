const Babysitter = require('../models/Babysitter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => res.send('Babysitter signup');
exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        // Allow login by email or phone
        const babysitter = await Babysitter.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        });
        if (!babysitter) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, babysitter.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: babysitter._id,
            email: babysitter.email,
            phone: babysitter.phone,
            profession: babysitter.profession
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, babysitter: payload });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyPhone = (req, res) => res.send('Babysitter verify phone');
exports.verifyEmail = (req, res) => res.send('Babysitter verify email');
exports.resendOtp = (req, res) => res.send('Babysitter resend OTP');
exports.uploadImages = (req, res) => res.send('Babysitter upload images');
exports.resetPassword = (req, res) => res.send('Babysitter reset password');
exports.forgetPassword = (req, res) => res.send('Babysitter forget password');
exports.getAll = (req, res) => res.send('Get all babysitters');
exports.getById = (req, res) => res.send('Get babysitter by id');
exports.update = (req, res) => res.send('Update babysitter');
exports.delete = (req, res) => res.send('Delete babysitter');
exports.verifyDocs = (req, res) => res.send('Babysitter verify docs'); 