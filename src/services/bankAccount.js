const BankAccount = require('../models/BankAccount');

exports.createBankAccount = async (babysitterId, accountNumber, name, ifsc) => {
    const bankAccount = new BankAccount({ babysitterId, accountNumber, name, ifsc });
    await bankAccount.save();
    return bankAccount;
}

exports.getBankAccountsByBabysitter = async (babysitterId) => {
    const bankAccounts = await BankAccount.find({ babysitterId });
    return bankAccounts;
}

exports.updateBankAccount = async (id, accountNumber, name, ifsc) => {
    const bankAccount = await BankAccount.findByIdAndUpdate(id, { accountNumber, name, ifsc }, { new: true });
    return bankAccount;
}

exports.deleteBankAccount = async (id) => {
    const bankAccount = await BankAccount.findByIdAndDelete(id);
    return bankAccount;
}