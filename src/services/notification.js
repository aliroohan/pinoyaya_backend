const Notification = require('../models/Notification');

exports.create = async (customerId, babysitterId, description) => {
    const notification = new Notification({ customerId, babysitterId, description });
    await notification.save();
    return notification;
}

exports.getByUser = async (userId) => {
    const notifications = await Notification.find({ $or: [{ customerId: userId }, { babysitterId: userId }] });
    return notifications;
}

exports.delete = async (id) => {
    await Notification.findByIdAndDelete(id);
}