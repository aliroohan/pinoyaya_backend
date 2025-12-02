const subscriptionService = require('../services/subscription');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user._id
    const subscriptionId = req.params.id;
    const subscription = await subscriptionService.subscribe(userId, subscriptionId);
    res.status(201).json({ status: "success", data: subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    res.status(200).json({ status: "success", data: subscriptions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubscription = [upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    const raw = fs.readFileSync(filePath);
    const jsonData = JSON.parse(raw);
    const subscription = await subscriptionService.createSubscription(jsonData);
    res.status(201).json({ status: "success", data: subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    // Delete the file in all cases (success or error)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}]