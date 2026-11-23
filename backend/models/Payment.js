const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // 'Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'
  date: { type: Date, required: true },
  transactionId: String, // UTR, Txn ID, Auth Code, Reference No.

  // UPI Specific
  upiId: String,        // e.g. user@okhdfcbank
  paymentApp: String,   // e.g. Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, Other

  // Bank Transfer Specific
  bankName: String,     // e.g. SBI, HDFC, ICICI
  accountNumber: String,// e.g. Account No or last 4 digits
  transferType: String, // e.g. IMPS, NEFT, RTGS, Direct Transfer

  // Card Specific
  cardType: String,     // Credit Card / Debit Card
  cardNetwork: String,  // Visa, Mastercard, RuPay, Amex, Other
  cardLast4: String,    // Last 4 digits of card (e.g. 1234)

  // Remarks / Notes
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
