const childModel = require('../models/child');


exports.createChild = async (childData) => {
    const child = new childModel(childData);
    await child.save();
    return child;
}

exports.findChildsByCustomerId = async (customerId) => {
    const children = await childModel.find({ customerId: customerId });
    return children;
}

exports.updateChild = async (id, childData) => {
    const child = await childModel.findByIdAndUpdate(id, childData, { new: true });
    return child;
}

exports.deleteChild = async (id) => {
    await childModel.findByIdAndDelete(id);
}