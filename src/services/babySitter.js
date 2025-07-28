const babysitter = require('../models/babysitter');
const Wallet = require('../models/wallet');

exports.getAllBabysitters = async () => {
    const babysitters = await babysitter.find();
    return babysitters;
};

exports.createBabysitter = async (babysitterData) => {
    const babysitter = new babysitter(babysitterData);
    await babysitter.save();
    const wallet = new Wallet({ babysitterId: babysitter._id });
    await wallet.save();
    return babysitter;
};

exports.getBabysitterById = async (id) => {
    const babysitter = await babysitter.findById(id);
    return babysitter;
};

exports.getBabysitter = async (phone, email = null) => {
    const babysitter = await babysitter.findOne({
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
    const babysitter = await babysitter.findByIdAndUpdate(id, data, { new: true });
    return babysitter;
};

exports.deleteBabysitter = async (id) => {
    const babysitter = await babysitter.findByIdAndDelete(id);
    return babysitter;
};

exports.verifyDocs = async (id) => {
    const babysitter = await babysitter.findByIdAndUpdate(id, { idVerified: true }, { new: true });
    return babysitter;
};
