const { createLocation, getLocationsByUser, updateLocation, deleteLocation, updateDefaultLocation } = require('../services/location');

exports.create = async (req, res) => {
    try {
        const user = req.user;
        let locationData = req.body;
        if (user.type === 'customer') {
            locationData.customerId = user._id;
        } else if (user.type === 'babysitter') {
            locationData.babysitterId = user._id;
        } else {
            return res.status(400).json({ error: 'User must be a customer or babysitter' });
        }
        const location = await createLocation(locationData);
        res.status(201).json({ message: 'Location created successfully', location });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const user = req.user;
        const locations = await getLocationsByUser(user);
        res.status(200).json({ message: 'Locations fetched successfully', locations });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { locationId } = req.params;
        const { title, house, area, directions, label, longitude, latitude, isDefault } = req.body;
        const location = await updateLocation(locationId, title, house, area, directions, label, longitude, latitude, isDefault);
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.updateDefault = async (req, res) => {
    try {
        const { locationId } = req.params;
        const user = req.user;
        const location = await updateDefaultLocation(locationId, user);
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { locationId } = req.params;
        const location = await deleteLocation(locationId);
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};