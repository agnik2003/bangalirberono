const Bill = require('../models/Bill');
const Payment = require('../models/Payment');

const updateBillPaymentStatus = async (billId) => {
  const bill = await Bill.findById(billId);
  if (!bill) return;

  const payments = await Payment.find({ billId });
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const dueAmount = bill.totalAmount - totalPaid;
  let paymentStatus = totalPaid === 0 ? 'PENDING' : (totalPaid >= bill.totalAmount ? 'PAID' : 'PARTIALLY PAID');

  bill.advancePaid = totalPaid;
  bill.dueAmount = dueAmount;
  bill.paymentStatus = paymentStatus;
  await bill.save();
};

exports.addPayment = async (req, res) => {
  try {
    const bill = await Bill.findById(req.body.billId);
    if (!bill) return res.status(404).json({ success: false, error: 'Bill not found' });

    const amount = parseFloat(req.body.amount) || 0;
    if (amount <= 0) return res.status(400).json({ success: false, error: 'Payment amount must be greater than zero.' });

    if (amount > bill.dueAmount && bill.dueAmount > 0) {
      return res.status(400).json({ success: false, error: `Payment cannot be greater than the remaining balance of ₹${bill.dueAmount}.` });
    }

    const newPayment = new Payment({
      ...req.body,
      amount
    });
    await newPayment.save();

    await updateBillPaymentStatus(req.body.billId);

    res.status(201).json({ success: true, message: 'Payment added', data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

    const newAmount = parseFloat(req.body.amount);
    if (newAmount !== undefined) {
      if (newAmount <= 0) return res.status(400).json({ success: false, error: 'Payment amount must be greater than zero.' });
      
      const bill = await Bill.findById(payment.billId);
      // Verify if new amount would exceed bill total (subtract old amount, add new amount)
      const otherPaymentsTotal = bill.advancePaid - payment.amount;
      if (otherPaymentsTotal + newAmount > bill.totalAmount) {
         return res.status(400).json({ success: false, error: `Payment would exceed the bill total. Max allowed is ₹${bill.totalAmount - otherPaymentsTotal}.` });
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await updateBillPaymentStatus(payment.billId);

    res.status(200).json({ success: true, message: 'Payment updated', data: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

    const billId = payment.billId;
    await Payment.findByIdAndDelete(req.params.id);
    
    await updateBillPaymentStatus(billId);

    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
