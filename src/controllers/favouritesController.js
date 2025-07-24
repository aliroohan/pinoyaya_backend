const { add, getByCustomer, deleteFavourite } = require('../services/favourites');

exports.add = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { babysitterId } = req.body;
        const favourite = await add(customerId, babysitterId);
        res.status(201).json(favourite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getByCustomer = async (req, res) => {
    try {
        const customerId = req.user._id;
        const favourites = await getByCustomer(customerId);
        res.json(favourites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteFavourite(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
