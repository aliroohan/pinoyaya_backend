const notification = require('../models/notification');

exports.create = async (customerId, babysitterId, description) => {
    const notification = new notification({ customerId, babysitterId, description });
    await notification.save();
    return notification;
}

exports.getByUser = async (userId) => {
    const notifications = await notification.find({ $or: [{ customerId: userId }, { babysitterId: userId }] });
    return notifications;
}

exports.delete = async (id) => {
    await notification.findByIdAndDelete(id);
}