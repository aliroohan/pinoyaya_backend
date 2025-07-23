const Babysitter = require('../models/Babysitter');

exports.getAllBabysitters = async () => {
    const babysitters = await Babysitter.find();
    return babysitters;
};

exports.createBabysitter = async (babysitterData) => {
    const babysitter = new Babysitter(babysitterData);
    await babysitter.save();
    return babysitter;
};

exports.getBabysitterById = async (id) => {
    const babysitter = await Babysitter.findById(id);
    return babysitter;
};

exports.getBabysitter = async (phone, email = null) => {
    const babysitter = await Babysitter.findOne({
        $or: [
            { phone },
            { email }
        ]
    });
    return babysitter;
};

exports.verifyPhone = async (phone, code) => {
    const babysitter = await getBabysitter(phone);
    if (!babysitter) {
        throw new Error('Babysitter not found');
    }
    if (babysitter.phoneVerificationCode !== code) {
        throw new Error('Invalid verification code');
    }
    babysitter.phoneVerified = true;
    await babysitter.save();
    return babysitter;
};

exports.updateBabysitter = async (id, data) => {
    const babysitter = await Babysitter.findByIdAndUpdate(id, data, { new: true });
    return babysitter;
};

exports.deleteBabysitter = async (id) => {
    const babysitter = await Babysitter.findByIdAndDelete(id);
    return babysitter;
};

exports.verifyDocs = async (id) => {
    const babysitter = await Babysitter.findByIdAndUpdate(id, { idVerified: true }, { new: true });
    return babysitter;
};
