const bankAccountModel = require('../models/bankAccount');

exports.createBankAccount = async (babysitterId, accountNumber, name, ifsc) => {
    const bankAccount = new bankAccountModel({ babysitterId, accountNumber, name, ifsc });
    await bankAccount.save();
    return bankAccount;
}

exports.getBankAccountsByBabysitter = async (babysitterId) => {
    const bankAccounts = await bankAccountModel.find({ babysitterId });
    return bankAccounts;
}

exports.updateBankAccount = async (id, accountNumber, name, ifsc) => {
    const bankAccount = await bankAccountModel.findByIdAndUpdate(id, { accountNumber, name, ifsc }, { new: true });
    return bankAccount;
}

exports.deleteBankAccount = async (id) => {
    const bankAccount = await bankAccountModel.findByIdAndDelete(id);
    return bankAccount;
}