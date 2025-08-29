const customerModel = require('../models/customer');

exports.createCustomer = async (customerData) => {
    const customer = new customerModel(customerData);
    await customer.save();
    return customer;
};

exports.findCustomerByEmail = async (email) => {
    const customer = await customerModel.findOne({ email });
    return customer;
};

exports.updateCustomer = async (customerId, customerData) => {
    const customer = await customerModel.findByIdAndUpdate(customerId, customerData, { new: true });
    return customer;
};

exports.deleteCustomer = async (customerId) => {
    const customer = await customerModel.findByIdAndDelete(customerId);
    return customer;
};

exports.getAllCustomers = async () => {
    const customers = await customerModel.find();
    return customers;
};

exports.getCustomerById = async (customerId) => {
    const customer = await customerModel.findById(customerId);
    return customer;
};

exports.verifyDocs = async (customerId) => {
    const customer = await customerModel.findByIdAndUpdate(customerId, { idVerified: true });
    return customer;
};