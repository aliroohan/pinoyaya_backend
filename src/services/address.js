const Address = require('../models/Address');

exports.createAddress = async (addressData) => {
    const address = new Address(addressData);
    await address.save();
    return address;
};

exports.getAddressesByUser = async (user) => {
    if (user.type === 'customer') {
        const addresses = await Address.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        const addresses = await Address.find({ babysitterId: user._id });
        return addresses;
    } else {
        throw new Error('User must be a customer or babysitter');
    }
    return addresses;
};

exports.updateAddress = async (addressId, addressData) => {
    const address = await Address.findByIdAndUpdate(addressId, addressData, { new: true });
    return address;
};

exports.updateDefaultAddress = async (addressId, user) => {
    const address = await Address.findById(addressId);
    if (user.type === 'customer') {
        const addresses = await Address.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        const addresses = await Address.find({ babysitterId: user._id });
    } else {
        throw new Error('Address must have either customerId or babysitterId');
    }
    if (address.isDefault) {
        return address;
    }
    addresses.forEach(async (address) => {
        address.isDefault = false;
        await address.save();
    });
    address.isDefault = true;
    await address.save();
    return address;
};

exports.deleteAddress = async (addressId) => {
    const address = await Address.findByIdAndDelete(addressId);
    return address;
}