const customerModel = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { VerificationCode } = require('../services/twilio');
const { createCustomer, findCustomerByPhone, updateCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomerById, verifyDocs } = require('../services/customer');
const { createChild } = require('../services/child');
const { createPet } = require('../services/pet');
const { uploadImages } = require('../services/s3Service');

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        debugger;
        const customer = await customerModel.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!customer.phoneVerified) {
            return res.status(401).json({ message: 'Phone not verified' });
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
    debugger;
    // console.log(req.body);
    const { firstName, lastName, email, phone, password } = req.body;
    try {
        const existingCustomer = await customerModel.findOne({ email: email, phone: phone });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }
        // console.log(req.body);
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const customer = await createCustomer({ firstName, lastName, email, phone, password, phoneVerificationCode });
        console.log(customer);
        const twilioResponse = await VerificationCode(customer);
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyPhone = async (req, res) => {
    const { phone, code } = req.body;
    const customer = await findCustomerByPhone(phone);
    if (!customer) {
        return res.status(400).json({ message: 'Customer not found' });
    }
    if (customer.phoneVerificationCode !== code) {
        return res.status(400).json({ message: 'Invalid code' });
    }
    customer.phoneVerified = true;
    await customer.save();
    res.status(200).json({ message: 'Phone verified' });
}

exports.childAndPets = async (req, res) => {
    const { children, pets } = req.body;
    for (const child of children) {
        const childData = {
            customerId: req.customer._id,
            name: child.name,
            age: child.age,
            gender: child.gender
        }
        await createChild(childData);
    }
    for (const pet of pets) {
        const petData = {
            customerId: req.customer._id,
            name: pet.name,
            breed: pet.breed
        }
        await createPet(petData);
    }
    res.status(200).json({ message: 'Child and pets created' });
}

exports.uploadImages = async (req, res) => {
    try {
        const { photo, front, back } = req.body;

        const customerId = req.customer._id;
        const photoUrl = await uploadImages(photo, customerId);
        const frontImageUrl = await uploadImages(front, customerId);
        const backImageUrl = await uploadImages(back, customerId);
        const customer = await updateCustomer(customerId, { photoUrl: photoUrl, verificationIdPhotoUrls: [frontImageUrl, backImageUrl] });
        res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        const customer = await findCustomerByPhone(phone);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const user = await updateCustomer(customer._id, { phoneVerificationCode });
        const twilioResponse = await VerificationCode(customer, phoneVerificationCode);
        res.status(200).json({ message: 'OTP sent successfully', twilioResponse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.resetPassword = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const customer = await findCustomerByPhone(phone);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateCustomer(customer._id, { password: hashedPassword });
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.forgetPassword = async (req, res) => {
    const { phone } = req.body;
    try {
        const customer = await findCustomerByPhone(phone);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const user = await updateCustomer(customer._id, { phoneVerificationCode });
        const twilioResponse = await VerificationCode(customer, phoneVerificationCode);
        res.status(200).json({ message: 'OTP sent successfully', twilioResponse });
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
        const customer = await updateCustomerById(id, { firstName, lastName, email, phone, password, description });
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