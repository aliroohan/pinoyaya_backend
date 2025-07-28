const child = require('../models/child');


exports.createChild = async (childData) => {
    const child = new child(childData);
    await child.save();
    return child;
}

exports.findChildsByCustomerId = async (customerId) => {
    const children = await child.find({ customerId: customerId });
    return children;
}

exports.updateChild = async (id, childData) => {
    const child = await child.findByIdAndUpdate(id, childData, { new: true });
    return child;
}

exports.deleteChild = async (id) => {
    await child.findByIdAndDelete(id);
}