const location = require('../models/location');

exports.createLocation = async (locationData) => {
    const location = new location(locationData);
    await location.save();
    return location;
};

exports.getLocationsByUser = async (user) => {
    let locations;
    if (user.type === 'customer') {
        locations = await location.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        locations = await location.find({ babysitterId: user._id });
    } else {
        throw new Error('User must be a customer or babysitter');
    }
    return locations;
};

exports.updateLocation = async (locationId, locationData) => {
    const location = await location.findByIdAndUpdate(locationId, locationData, { new: true });
    return location;
};

exports.updateDefaultLocation = async (locationId, user) => {
    const location = await location.findById(locationId);
    let locations;
    if (user.type === 'customer') {
        locations = await location.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        locations = await location.find({ babysitterId: user._id });
    } else {
        throw new Error('Location must have either customerId or babysitterId');
    }
    if (location.isDefault) {
        return location;
    }
    locations.forEach(async (loc) => {
        loc.isDefault = false;
        await loc.save();
    });
    location.isDefault = true;
    await location.save();
    return location;
};

exports.deleteLocation = async (locationId) => {
    const location = await location.findByIdAndDelete(locationId);
    return location;
};