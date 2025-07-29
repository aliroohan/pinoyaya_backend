const favouriteModel = require('../models/favourite');

exports.add = async (customerId, babysitterId) => {
    const favourite = new favouriteModel({ customerId, babysitterId });
    await favourite.save();
    return favourite;
}

exports.getByCustomer = async (customerId) => {
    const favourites = await favouriteModel.find({ customerId });
    return favourites;
}

exports.delete = async (id) => {
    await favouriteModel.findByIdAndDelete(id);
}