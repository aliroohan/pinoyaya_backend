const Favourite = require('../models/Favourite');

exports.add = async (customerId, babysitterId) => {
    const favourite = new Favourite({ customerId, babysitterId });
    await favourite.save();
    return favourite;
}

exports.getByCustomer = async (customerId) => {
    const favourites = await Favourite.find({ customerId });
    return favourites;
}

exports.delete = async (id) => {
    await Favourite.findByIdAndDelete(id);
}