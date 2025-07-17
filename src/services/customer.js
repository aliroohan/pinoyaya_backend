const Customer = require('../models/Customer');

exports.createCustomer = async (customerData) => {
    const customer = new Customer(customerData);
    await customer.save();
    return customer;
};