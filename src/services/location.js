const locationModel = require('../models/location');

exports.createLocation = async (locationData, user) => {
    let loc = await locationModel.find(
        { $or: [
            { customerId: user._id },
            { babysitterId: user._id }
        ]
    }); 
    if (locationData.isDefault) {
        loc.forEach(async (loc) => {
            loc.isDefault = false;
            await loc.save();
        });
        locationData.isDefault = true;
    }
    if (loc.length === 0) {
        locationData.isDefault = true;
    }

    const location = new locationModel(locationData);
    await location.save();
    return location;
};

exports.getLocationsByUser = async (user) => {
    let locations;
    if (user.type === 'customer') {
        locations = await locationModel.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        locations = await locationModel.find({ babysitterId: user._id });
    } else {
        throw new Error('User must be a customer or babysitter');
    }
    return locations;
};

exports.updateLocation = async (locationId, locationData) => {
    const location = await locationModel.findByIdAndUpdate(locationId, locationData, { new: true });
    return location;
};

exports.updateDefaultLocation = async (locationId, user) => {
    const location = await locationModel.findById(locationId);
    let locations;
    if (user.type === 'customer') {
        locations = await locationModel.find({ customerId: user._id });
    } else if (user.type === 'babysitter') {
        locations = await locationModel.find({ babysitterId: user._id });
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
    const location = await locationModel.findByIdAndDelete(locationId);
    return location;
};