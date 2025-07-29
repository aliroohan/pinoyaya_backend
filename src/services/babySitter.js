const babysitterModel = require('../models/babysitter');
const Wallet = require('../models/wallet');

exports.getAllBabysitters = async () => {
    const babysitters = await babysitterModel.find();
    return babysitters;
};

exports.createBabysitter = async (babysitterData) => {
    const babysitter = new babysitterModel(babysitterData);
    await babysitter.save();
    const wallet = new Wallet({ babysitterId: babysitter._id });
    await wallet.save();
    return babysitter;
};

exports.getBabysitterById = async (id) => {
    const babysitter = await babysitterModel.findById(id);
    return babysitter;
};

exports.getBabysitter = async (phone, email = null) => {
    const babysitter = await babysitterModel.findOne({
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
    const babysitter = await babysitterModel.findByIdAndUpdate(id, data, { new: true });
    return babysitter;
};

exports.deleteBabysitter = async (id) => {
    const babysitter = await babysitterModel.findByIdAndDelete(id);
    return babysitter;
};

exports.verifyDocs = async (id) => {
    const babysitter = await babysitterModel.findByIdAndUpdate(id, { idVerified: true }, { new: true });
    return babysitter;
};
