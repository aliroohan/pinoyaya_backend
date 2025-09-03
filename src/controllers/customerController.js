const customerModel = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/mail');
const { createCustomer, findCustomerByEmail, updateCustomer, deleteCustomer, getAllCustomers, getCustomerById, verifyDocs } = require('../services/customer');
const { createChild } = require('../services/child');
const { create } = require('../services/pet');
const { uploadImage } = require('../services/s3Service');
const multer = require('multer');
const upload = multer();

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        const customer = await customerModel.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!customer.emailVerified) {
            return res.status(401).json({ message: 'Email not verified' });
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
        const existingCustomer = await customerModel.findOne({ email: email, phone: phone });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }   
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const customer = await createCustomer({ firstName, lastName, email, phone, password, emailVerificationCode });
        const emailResponse = await sendOtpEmail(customer.email, emailVerificationCode, customer.firstName);
        const payload = {
            id: customer._id,
            email: customer.email,
            phone: customer.phone
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'Customer created successfully',token, customer : payload});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    const customer = await findCustomerByEmail(email);
    if (!customer) {
        return res.status(400).json({ message: 'Customer not found' });
    }
    if (customer.emailVerificationCode !== code) {
        return res.status(400).json({ message: 'Invalid code' });
    }
    customer.emailVerified = true;
    await customer.save();
    res.status(200).json({ message: 'Email verified' });
}

exports.childAndPets = async (req, res) => {
    const { children, pets } = req.body;
    for (const child of children) {
        const childData = {
            customerId: req.user._id,
            name: child.name,
            age: child.age,
            gender: child.gender
        }
        await createChild(childData);
    }
    for (const pet of pets) {
        const petData = {
            customerId: req.user._id,
            name: pet.name,
            breed: pet.breed
        }
        await create(petData);
    }
    res.status(200).json({ message: 'Child and pets created' });
}

exports.uploadImages = [
    upload.fields([{ name: 'photo' }, { name: 'front' }, { name: 'back' }]),
    async (req, res) => {
    try {
        const customerId = req.user._id;
        const photoUrl = await uploadImage(req.files.photo[0].buffer, req.files.photo[0].originalname, req.files.photo[0].mimetype);
        const frontImageUrl = await uploadImage(req.files.front[0].buffer, req.files.front[0].originalname, req.files.front[0].mimetype);
        const backImageUrl = await uploadImage(req.files.back[0].buffer, req.files.back[0].originalname, req.files.back[0].mimetype);
        const customer = await updateCustomer(customerId, { photoUrl: photoUrl, verificationIdPhotoUrls: [frontImageUrl, backImageUrl] });
        res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}];


exports.resendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const customer = await findCustomerByEmail(email);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const user = await updateCustomer(customer._id, { emailVerificationCode });
        const emailResponse = await sendOtpEmail(customer.email, emailVerificationCode, customer.firstName);
        res.status(200).json({ message: 'OTP sent successfully', emailResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await findCustomerByEmail(email);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        if (!customer.emailVerified) {
            return res.status(400).json({ message: 'Verify your email first' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateCustomer(customer._id, { password: hashedPassword });
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const customer = await findCustomerByEmail(email);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const user = await updateCustomer(customer._id, { emailVerificationCode, emailVerified: false });
        const emailResponse = await sendOtpEmail(customer.email, emailVerificationCode, customer.firstName);
        res.status(200).json({ message: 'OTP sent successfully', emailResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getAll = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getById = async (req, res) => {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) {
        return res.status(400).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
}

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const { firstName, lastName, email, phone, password, description } = req.body;
        const customer = await updateCustomer(id, { firstName, lastName, email, phone, password, description });
        res.status(200).json({
            message: 'Customer updated successfully',
            customer
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.delete = async (req, res) => {
    const { id } = req.params;
    const customer = await deleteCustomer(id);
    res.status(200).json({
        message: 'Customer deleted successfully',
        customer
    });
}

exports.verifyDocs = async (req, res) => {
    const { id } = req.params;
    const customer = await verifyDocs(id);
    res.status(200).json({
        message: 'Customer verify docs successfully',
        customer
    });
}