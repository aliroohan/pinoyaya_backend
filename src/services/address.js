const Address = require('../models/Address');

exports.createAddress = async (addressData) => {
    const address = new Address(addressData);
    await address.save();
    return address;
};

exports.getAddressesByUser = async (customerId, babysitterId) => {
    const addresses = await Address.find({ customerId, babysitterId });
    return addresses;
};

exports.updateAddress = async (addressId, addressData) => {
    const address = await Address.findByIdAndUpdate(addressId, addressData, { new: true });
    return address;
};

exports.updateDefaultAddress = async (addressId, customerId, babysitterId) => {
    const address = await Address.findById(addressId);
    const addresses = await Address.find({ customerId, babysitterId });
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