const { findChildsByCustomerId, updateChild, deleteChild, findChildById } = require('../services/child');

exports.getAll = async (req, res) => {
    try {
        const user = req.user;
        const children = await findChildsByCustomerId(user._id);
        res.status(200).json({
            message: 'Children fetched successfully',
            data: children,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const child = await findChildById(id);
        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, specialNeeds } = req.body;
        const child = await updateChild(id, { name, age, gender, specialNeeds });
        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteChild(id);
        res.status(200).json({ message: 'Child deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}