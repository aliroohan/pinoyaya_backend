const notificationModel = require('../models/notification');

exports.create = async (customerId, babysitterId, description) => {
    const notification = new notificationModel({ customerId, babysitterId, description });
    await notification.save();
    return notification;
}

exports.getByUser = async (userId) => {
    const notifications = await notificationModel.find({ $or: [{ customerId: userId }, { babysitterId: userId }] });
    return notifications;
}

exports.delete = async (id) => {
    await notificationModel.findByIdAndDelete(id);
}