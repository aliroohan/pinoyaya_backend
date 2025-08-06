const paymentsService = require('../services/payments');

exports.create = async (req, res) => {
  try {
    const payment = await paymentsService.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCustomer = async (req, res) => {
  try {
    const payments = await paymentsService.getByCustomer(req.params.customerId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByJob = async (req, res) => {
  try {
    const payments = await paymentsService.getByJob(req.params.jobId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payment = await paymentsService.update(req.params.id, req.body);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.makePayment = async (req, res) => {
  try {
    const {
      paymentId,
      amount,
      currency = 'usd',
      cardId, // For saved card
      newCardData, // For new card
      saveCard = false,
      customerId,
      babysitterId,
      jobId
    } = req.body;

    // Validate required fields
    if (!paymentId || !amount || !customerId || !babysitterId || !jobId) {
      return res.status(400).json({ 
        error: 'Missing required fields: paymentId, amount, customerId, babysitterId, jobId' 
      });
    }

    // Validate that either cardId or newCardData is provided
    if (!cardId && !newCardData) {
      return res.status(400).json({ 
        error: 'Either cardId (for saved card) or newCardData (for new card) must be provided' 
      });
    }

    // Validate newCardData structure if provided
    if (newCardData) {
      const { number, exp_month, exp_year, cvc } = newCardData;
      if (!number || !exp_month || !exp_year || !cvc) {
        return res.status(400).json({ 
          error: 'newCardData must include: number, exp_month, exp_year, cvc' 
        });
      }
    }

    const result = await paymentsService.makePayment({
      paymentId,
      amount,
      currency,
      cardId,
      newCardData,
      saveCard,
      customerId,
      babysitterId,
      jobId
    });

    res.json({
      success: result.success,
      message: result.success ? 'Payment processed successfully' : 'Payment failed',
      transaction: result.transaction,
      payment: result.payment
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ 
      error: err.message,
      success: false 
    });
  }
};