const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createBabysitter, getBabysitter, getBabysitterById, verifyPhone, updateBabysitter, getAllBabysitters, deleteBabysitter, verifyDocs: verifyDocsService, getBabysittersByFilter } = require('../services/babySitter');
const { VerificationCode } = require('../services/twilio');

exports.signup = async (req, res) => {
    const { firstName, lastName, email, phone, password, profession } = req.body;
    try {
        const existingBabysitter = await getBabysitter(phone, email);
        if (existingBabysitter) {
            return res.status(400).json({ message: 'Babysitter already exists' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const babysitter = await createBabysitter({ firstName, lastName, email, phone, password: hashedPassword, profession, phoneVerificationCode });
        const token = jwt.sign({ id: babysitter._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const message = await VerificationCode(babysitter);
        res.status(201).json({ token, babysitter });
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
        if (!babysitter.phoneVerified) {
            return res.status(401).json({ message: 'Phone not verified' });
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
exports.verifyPhone = async (req, res) =>  {
    const { phone, code } = req.body;
    try {
        const babysitter = await verifyPhone(phone, code);
        res.json({ babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        const babysitter = await getBabysitter(phone);
        if (!babysitter) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        babysitter.phoneVerificationCode = phoneVerificationCode;
        await babysitter.save();
        const message = await VerificationCode(babysitter);
        res.json({ babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.uploadImages = async (req, res) => {
    try {
        const { photo, front, back } = req.body;

        const babySitterId = req.user._id;
        const photoUrl = await uploadImages(photo, babySitterId);
        const frontImageUrl = await uploadImages(front, babySitterId);
        const backImageUrl = await uploadImages(back, babySitterId);
        const babysitter = await updateBabysitter(babySitterId, { photoUrl: photoUrl, verificationIdPhotoUrls: [frontImageUrl, backImageUrl] });
        res.status(200).json({ message: 'Images uploaded successfully', babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.resetPassword = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const babysitter = await getBabysitter(phone);
        if (!babysitter) {
            return res.status(400).json({ message: 'Babysitter not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateBabysitter(babysitter._id, { password: hashedPassword });
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.forgetPassword = async (req, res) => {
    const { phone } = req.body;
    try {
        const babysitter = await getBabysitter(phone);
        if (!babysitter) {
            return res.status(400).json({ message: 'Babysitter not found' });
        }
        const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
        babysitter.phoneVerificationCode = phoneVerificationCode;
        babysitter.phoneVerified = false;
        const babysitterData = await updateBabysitter(babysitter._id, { phoneVerificationCode, phoneVerified: false });
        const message = await VerificationCode(babysitterData);
        res.status(200).json({ message: 'Password reset code sent to phone', babysitter: babysitterData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getAll = async (req, res) => {
    try {
        const babysitters = await getAllBabysitters();
        res.status(200).json(babysitters);
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
        const babysitter = await getBabysitterById(id);
        if (!babysitter) {
            return res.status(404).json({ message: 'Babysitter not found' });
        }
        res.status(200).json(babysitter);
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
        res.status(200).json(babysitter);
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
        res.status(200).json({ message: 'Babysitter deleted successfully' });
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
        res.status(200).json({ message: 'Documents verified successfully', babysitter });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};