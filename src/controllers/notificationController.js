const { create, getByUser, deleteNotification } = require('../services/notification');

exports.create = async (req, res) => {
    const { customerId, babysitterId, description } = req.body;
    const notification = await create(customerId, babysitterId, description);
    res.status(201).json(notification);
}
exports.getByUser = async (req, res) => {
    const { userId } = req.user._id;
    const notifications = await getByUser(userId);
    res.json(notifications);
}
exports.delete = async (req, res) => {
    const { id } = req.params;
    await deleteNotification(id);
    res.status(204).send();
}