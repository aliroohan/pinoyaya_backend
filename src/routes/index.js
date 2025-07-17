const express = require('express');
const router = express.Router();

router.use('/customer', require('./customer'));
router.use('/child', require('./child'));
router.use('/address', require('./address'));
router.use('/pet', require('./pet'));
router.use('/babysitter', require('./babysitter'));
router.use('/certificates', require('./certificates'));
router.use('/card', require('./card'));
router.use('/notification', require('./notification'));
router.use('/favourites', require('./favourites'));
router.use('/job', require('./job'));
router.use('/request', require('./request'));
router.use('/review', require('./review'));
router.use('/payments', require('./payments'));
router.use('/bankaccount', require('./bankaccount'));
router.use('/wallet', require('./wallet'));
router.use('/transactions', require('./transactions'));
router.use('/subscription', require('./subscription'));
router.use('/chat', require('./chat'));
router.use('/message', require('./message'));

module.exports = router; 