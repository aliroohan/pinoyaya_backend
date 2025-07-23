const { createAddress, getAddressesByUser, updateAddress, deleteAddress, updateDefaultAddress } = require('../services/address');

exports.create = async (req, res) => {
    try {
        const user = req.user;
        let addressData = req.body;
        if (user.type === 'customer') {
            addressData.customerId = user._id;
        } else if (user.type === 'babysitter') {
            addressData.babysitterId = user._id;
        } else {
            return res.status(400).json({ error: 'User must be a customer or babysitter' });
        }
        const address = await createAddress(addressData);
        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const user = req.user;
        const addresses = await getAddressesByUser(user);
        res.status(200).json({ message: 'Addresses fetched successfully', addresses });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { title, house, area, directions, label, longitude, latitude, isDefault } = req.body;
        const address = await updateAddress(addressId, title, house, area, directions, label, longitude, latitude, isDefault);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.updateDefault = async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = req.user;
        const address = await updateDefaultAddress(addressId, user);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await deleteAddress(addressId);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};