const favourite = require('../models/favourite');

exports.add = async (customerId, babysitterId) => {
    const favourite = new favourite({ customerId, babysitterId });
    await favourite.save();
    return favourite;
}

exports.getByCustomer = async (customerId) => {
    const favourites = await favourite.find({ customerId });
    return favourites;
}

exports.delete = async (id) => {
    await favourite.findByIdAndDelete(id);
}