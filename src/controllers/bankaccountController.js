const { createBankAccount, getBankAccountsByBabysitter, updateBankAccount, deleteBankAccount } = require('../services/bankAccount');

exports.create = async (req, res) => {
    const { babysitterId, accountNumber, name, ifsc } = req.body;
    const bankAccount = await createBankAccount(babysitterId, accountNumber, name, ifsc);
    res.status(201).json({ message: 'Bank account created successfully', bankAccount });
}
exports.getByBabysitter = async (req, res) => {
    const { babysitterId } = req.params;
    const bankAccounts = await getBankAccountsByBabysitter(babysitterId);
    res.status(200).json(bankAccounts);
}
exports.update = async (req, res) => {
    const { id } = req.params;
    const { accountNumber, name, ifsc } = req.body;
    const bankAccount = await updateBankAccount(id, accountNumber, name, ifsc);
    res.status(200).json({ message: 'Bank account updated successfully', bankAccount });
}
exports.delete = async (req, res) => {
    const { id } = req.params;
    await deleteBankAccount(id);
    res.status(200).json({ message: 'Bank account deleted successfully'});
}