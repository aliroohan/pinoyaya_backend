const { createAddress, getAddressesByUser, updateAddress, deleteAddress, updateDefaultAddress } = require('../services/address');

exports.create = async (req, res) => {
    try {
        const { customerId, babysitterId, title, house, area, directions, label, longitude, latitude, isDefault } = req.body;
        const address = await createAddress(customerId, babysitterId, title, house, area, directions, label, longitude, latitude, isDefault);
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const { customerId, babysitterId } = req.params;
        const addresses = await getAddressesByUser(customerId, babysitterId);
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { customerId, babysitterId, title, house, area, directions, label, longitude, latitude, isDefault } = req.body;
        const address = await updateAddress(addressId, customerId, babysitterId, title, house, area, directions, label, longitude, latitude, isDefault);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.updateDefault = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { customerId, babysitterId} = req.body;
        const address = await updateDefaultAddress(addressId, customerId, babysitterId);
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