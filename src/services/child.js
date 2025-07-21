const Child = require('../models/Child');


exports.createChild = async (childData) => {
    const child = new Child(childData);
    await child.save();
    return child;
}

exports.findChildByCustomerId = async (customerId) => {
    const child = await Child.find({ customerId: customerId });
    return child;
}