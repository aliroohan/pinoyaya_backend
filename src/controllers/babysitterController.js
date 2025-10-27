const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createBabysitter, getBabysitter, getBabysitterById, verifyEmail, updateBabysitter, getAllBabysitters, deleteBabysitter, verifyDocs: verifyDocsService, getBabysittersByFilter } = require('../services/babySitter');
const { sendOtpEmail } = require('../services/mail');
const multer = require('multer');
const upload = multer();

exports.signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    try {
        const existingBabysitter = await getBabysitter(phone, email);
        if (existingBabysitter) {
            return res.status(400).json({ message: 'Babysitter already exists' });
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const babysitter = await createBabysitter({ firstName, lastName, email, phone, password: hashedPassword, emailVerificationCode });
        const message = await sendOtpEmail(babysitter.email, emailVerificationCode, babysitter.firstName);
        const payload = {
            id: babysitter._id,
            ...babysitter.toObject()
        };
        delete payload.password;
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ status: "success", data: { token, babysitter: payload } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateProfession = async (req, res) => {
    const { profession } = req.body;
    try {
        const babysitter = await updateBabysitter(req.user._id, { profession });
        res.status(200).json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        const babysitter = await getBabysitter(phone, email);
        if (!babysitter) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, babysitter.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!babysitter.emailVerified) {
            return res.status(401).json({ message: 'Email not verified' });
        }
        const payload = {
            id: babysitter._id,
            email: babysitter.email,
            phone: babysitter.phone,
            profession: babysitter.profession
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ status: "success", data: { token, babysitter: payload } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyEmail = async (req, res) =>  {
    const { email, code } = req.body;
    try {
        const babysitter = await verifyEmail(email, code);
        res.json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.resendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const babysitter = await getBabysitter(null, email);
        if (!babysitter) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        babysitter.emailVerificationCode = emailVerificationCode;
        await babysitter.save();
        const message = await sendOtpEmail(babysitter.email, emailVerificationCode, babysitter.firstName);
        res.json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.uploadImages = [
    upload.fields([{ name: 'photo' }, { name: 'front' }, { name: 'back' }]),
    async (req, res) => {
    try {
        const babysitterId = req.user._id;
        const photoUrl = await uploadImage(req.files.photo[0].buffer, req.files.photo[0].originalname, req.files.photo[0].mimetype);
        const frontImageUrl = await uploadImage(req.files.front[0].buffer, req.files.front[0].originalname, req.files.front[0].mimetype);
        const backImageUrl = await uploadImage(req.files.back[0].buffer, req.files.back[0].originalname, req.files.back[0].mimetype);
        const babysitter = await updateBabysitter(babysitterId, { photoUrl: photoUrl, verificationIdPhotoUrls: [frontImageUrl, backImageUrl] });
        res.status(200).json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}];
exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const babysitter = await getBabysitter(null, email);
        if (!babysitter) {
            return res.status(400).json({ message: 'Babysitter not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateBabysitter(babysitter._id, { password: hashedPassword });
        res.status(200).json({ status: "success", message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const babysitter = await getBabysitter(null, email);
        if (!babysitter) {
            return res.status(400).json({ message: 'Babysitter not found' });
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
        babysitter.emailVerificationCode = emailVerificationCode;
        babysitter.emailVerified = false;
        const babysitterData = await updateBabysitter(babysitter._id, { emailVerificationCode, emailVerified: false });
        const message = await sendOtpEmail(babysitterData.email, emailVerificationCode, babysitterData.firstName);
        res.status(200).json({ status: "success", message: 'Password reset code sent to email', data: babysitterData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getAll = async (req, res) => {
    try {
        const babysitters = await getAllBabysitters();
        res.status(200).json({status: "success", data: babysitters});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getBabysittersByFilter = async (req, res) => {
    try {
        const { radius, available } = req.query;
        const user = req.user;
        
        const radiusKm = parseFloat(radius);
        const availableFilter = available !== undefined ? available === 'true' : undefined;

        const babysitters = await getBabysittersByFilter(radiusKm, availableFilter, user);
        
        res.status(200).json({
            success: true,
            count: babysitters.length,
            filters: {
                radius: radiusKm,
                available: availableFilter,
                availabilityLogic: availableFilter === true ? 
                    'Shows only available babysitters (not in ongoing jobs)' :
                    'Shows all babysitters in radius'
            },
            data: babysitters
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const babysitter = await getBabysitterById(id);
        if (!babysitter) {
            return res.status(404).json({ message: 'Babysitter not found' });
        }
        res.status(200).json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const babysitter = await updateBabysitter(id, data);
        if (!babysitter) {
            return res.status(404).json({ message: 'Babysitter not found' });
        }
        res.status(200).json({ status: "success", data: babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const babysitter = await deleteBabysitter(id);
        if (!babysitter) {
            return res.status(404).json({ message: 'Babysitter not found' });
        }
        res.status(200).json({ status: "success", message: 'Babysitter deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.verifyDocs = async (req, res) => {
    try {
        const { id } = req.params;
        const babysitter = await verifyDocsService(id);
        if (!babysitter) {
            return res.status(404).json({ message: 'Babysitter not found' });
        }
        res.status(200).json({ status: "success", message: 'Documents verified successfully', babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};