const Child = require('../models/Child');


exports.createChild = async (childData) => {
    const child = new Child(childData);
    await child.save();
    return child;
}

exports.findChildsByCustomerId = async (customerId) => {
    const children = await Child.find({ customerId: customerId });
    return children;
}

exports.updateChild = async (id, childData) => {
    const child = await Child.findByIdAndUpdate(id, childData, { new: true });
    return child;
}

exports.deleteChild = async (id) => {
    await Child.findByIdAndDelete(id);
}