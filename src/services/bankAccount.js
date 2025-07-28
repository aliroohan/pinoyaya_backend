const bankAccount = require('../models/bankAccount');

exports.createBankAccount = async (babysitterId, accountNumber, name, ifsc) => {
    const bankAccount = new bankAccount({ babysitterId, accountNumber, name, ifsc });
    await bankAccount.save();
    return bankAccount;
}

exports.getBankAccountsByBabysitter = async (babysitterId) => {
    const bankAccounts = await bankAccount.find({ babysitterId });
    return bankAccounts;
}

exports.updateBankAccount = async (id, accountNumber, name, ifsc) => {
    const bankAccount = await bankAccount.findByIdAndUpdate(id, { accountNumber, name, ifsc }, { new: true });
    return bankAccount;
}

exports.deleteBankAccount = async (id) => {
    const bankAccount = await bankAccount.findByIdAndDelete(id);
    return bankAccount;
}