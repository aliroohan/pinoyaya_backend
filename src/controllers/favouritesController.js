const { add, getByCustomer, deleteFavourite } = require('../services/favourites');

exports.add = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { babysitterId } = req.body;
        const favourite = await add(customerId, babysitterId);
        res.status(201).json({ success: true, data: favourite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getByCustomer = async (req, res) => {
    try {
        const customerId = req.user._id;
        const favourites = await getByCustomer(customerId);
        res.json({ success: true, data: favourites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteFavourite(id);
        res.status(204).json({ success: true, data: { message: 'Favourite deleted successfully' } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
