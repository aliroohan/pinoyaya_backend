const customer = require('../models/customer');

exports.createCustomer = async (customerData) => {
    const customer = new customer(customerData);
    await customer.save();
    return customer;
};

exports.findCustomerByPhone = async (phone) => {
    const customer = await customer.findOne({ phone });
    return customer;
};

exports.updateCustomer = async (customerId, customerData) => {
    const customer = await customer.findByIdAndUpdate(customerId, customerData, { new: true });
    return customer;
};

exports.deleteCustomer = async (customerId) => {
    const customer = await customer.findByIdAndDelete(customerId);
    return customer;
};

exports.getAllCustomers = async () => {
    const customers = await customer.find();
    return customers;
};

exports.getCustomerById = async (customerId) => {
    const customer = await customer.findById(customerId);
    return customer;
};

exports.verifyDocs = async (customerId) => {
    const customer = await customer.findByIdAndUpdate(customerId, { idVerified: true });
    return customer;
};