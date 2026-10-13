const express = require('express');
const router = express.Router();
const { sendBillEmail, sendCustomerEmail } = require('../controllers/emailController');

router.post('/send-bill', sendBillEmail);
router.post('/send-customer-message', sendCustomerEmail);
module.exports = router;
