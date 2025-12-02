const walletService = require('../services/wallet');

exports.getByBabysitter = async (req, res) => {
  try {
    const wallet = await walletService.getByBabysitter(req.params.babysitterId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const wallet = await walletService.update(req.params.id, req.body);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 