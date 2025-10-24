const favouriteModel = require('../models/favourite');

exports.add = async (customerId, babysitterId) => {
    const existingFavourite = await favouriteModel.findOne({ customerId, babysitterId });
    if (existingFavourite) {
        throw new Error('Favourite already exists');
    }
    const favourite = new favouriteModel({ customerId, babysitterId });
    await favourite.save();
    return favourite;
}

exports.getByCustomer = async (customerId) => {
    const favourites = await favouriteModel.find({ customerId });
    return favourites;
}

exports.deleteFavourite = async (id) => {

    await favouriteModel.findOneAndDelete({ babysitterId: id });
}