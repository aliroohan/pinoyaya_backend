const Customer = require('../models/Customer');

exports.createCustomer = async (customerData) => {
    const customer = new Customer(customerData);
    await customer.save();
    return customer;
};

exports.findCustomerByPhone = async (phone) => {
    const customer = await Customer.findOne({ phone: phone });
    return customer;
}

exports.updateCustomer = async (customerId, customerData) => {
    const customer = await Customer.findByIdAndUpdate(customerId, customerData, { new: true });
    return customer;
}

exports.deleteCustomer = async (customerId) => {
    const customer = await Customer.findByIdAndDelete(customerId);
    return customer;
}

exports.getAllCustomers = async () => {
    const customers = await Customer.find();
    return customers;
}

exports.getCustomerById = async (customerId) => {
    const customer = await Customer.findById(customerId);
    return customer;
}

exports.verifyDocs = async (customerId) => {
    const customer = await Customer.findByIdAndUpdate(customerId, { idVerified: true });
    return customer;
}