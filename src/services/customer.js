const customerModel = require('../models/customer');

exports.createCustomer = async (customerData) => {
	const customer = new customerModel(customerData);
	await customer.save();
	const customerObj = customer.toJSON();
	delete customerObj.password;
	return customerObj;
};

exports.findCustomerByEmail = async (email) => {
	const customer = await customerModel.findOne({ email }).select('-password');
	return customer;
};

exports.updateCustomer = async (customerId, customerData) => {
	const cust = await customerModel.findOne({ email: customerData.email });
	if (cust && cust._id.toString() !== customerId) {
		throw new Error('Email already exists');
	}
	const customer = await customerModel.findByIdAndUpdate(customerId, customerData, { new: true }).select('-password');
	return customer;
};

exports.deleteCustomer = async (customerId) => {
	const customer = await customerModel.findByIdAndDelete(customerId).select('-password');
	return customer;
};

exports.getAllCustomers = async () => {
	const customers = await customerModel.find().select('-password');
	return customers;
};

exports.getCustomerById = async (customerId) => {
	const customer = await customerModel.findById(customerId).select('-password');
	return customer;
};

exports.verifyDocs = async (customerId) => {
	const customer = await customerModel.findByIdAndUpdate(customerId, { idVerified: true }).select('-password');
	return customer;
};