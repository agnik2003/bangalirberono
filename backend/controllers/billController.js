const Bill = require('../models/Bill');
const InvoiceItem = require('../models/InvoiceItem');
const Payment = require('../models/Payment');
const { generateBillPDF } = require('../utils/pdfGenerator');
const { trackCustomerInteraction } = require('./customerController');

// Download Bill as PDF
exports.downloadBillPDF = async (req, res) => {
  try {
    const billDoc = await Bill.findById(req.params.id);
    if (!billDoc) return res.status(404).json({ success: false, error: 'Bill not found' });

    const items = await InvoiceItem.find({ billId: billDoc._id });
    const payments = await Payment.find({ billId: billDoc._id }).sort({ date: -1 });

    const billData = { ...billDoc.toObject(), items, payments };

    const clientUrl = req.query.clientUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
    const pdfBuffer = await generateBillPDF(billData, clientUrl);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice_${billDoc.billNumber}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF download error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    if (req.body.bookingId) {
      const existingBill = await Bill.findOne({ bookingId: req.body.bookingId });
      if (existingBill) {
        return res.status(400).json({ success: false, error: 'Bill already exists for this booking.' });
      }
    }

    const lastBill = await Bill.findOne().sort({ createdAt: -1, billDate: -1 });
    let nextNum = 1;
    if (lastBill && lastBill.billNumber && lastBill.billNumber.startsWith('BB-')) {
      const parts = lastBill.billNumber.split('-');
      if (parts.length === 2 && !isNaN(parts[1])) {
        nextNum = parseInt(parts[1]) + 1;
      }
    }
    const billNumber = `BB-${nextNum.toString().padStart(4, '0')}`;

    let items = req.body.items || [];
    let subtotal = 0;

    items.forEach(item => {
      item.amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
      subtotal += item.amount;
    });

    let discount = parseFloat(req.body.discount) || 0;
    let tax = parseFloat(req.body.tax) || 0;

    // Use passed totalAmount as fallback for backward compatibility
    let calculatedTotal = subtotal > 0 ? (subtotal - discount + tax) : (parseFloat(req.body.totalAmount) || 0);
    if (calculatedTotal < 0) calculatedTotal = 0;

    let advancePaid = parseFloat(req.body.advancePaid) || 0;

    if (calculatedTotal < 0 || advancePaid < 0) {
      return res.status(400).json({ success: false, error: 'Amounts cannot be negative.' });
    }
    if (advancePaid > calculatedTotal) {
      return res.status(400).json({ success: false, error: 'Amount Paid cannot be greater than Total Amount.' });
    }

    let dueAmount = calculatedTotal - advancePaid;
    let paymentStatus = advancePaid === 0 ? 'PENDING' : (advancePaid >= calculatedTotal ? 'PAID' : 'PARTIALLY PAID');

    const newBill = new Bill({
      ...req.body,
      totalAmount: calculatedTotal,
      subtotal,
      discount,
      tax,
      advancePaid,
      dueAmount,
      paymentStatus,
      billNumber
    });
    await newBill.save();

    // Save items
    if (items.length > 0) {
      const invoiceItems = items.map(item => ({
        billId: newBill._id,
        description: (item.description && item.description.trim()) ? item.description.trim() : (req.body.packageName || 'Tour Package'),
        quantity: parseFloat(item.quantity) || 0,
        rate: parseFloat(item.rate) || 0,
        amount: item.amount
      }));
      await InvoiceItem.insertMany(invoiceItems);
    }

    // Save initial payment if advancePaid > 0
    if (advancePaid > 0) {
      const initialPayment = new Payment({
        billId: newBill._id,
        amount: advancePaid,
        method: req.body.paymentMethod || 'Other',
        date: new Date(),
        notes: 'Initial Advance Payment'
      });
      await initialPayment.save();
    }

    await trackCustomerInteraction({
      name: newBill.customerName,
      phone: newBill.customerPhone,
      email: newBill.customerEmail,
      type: 'Bill',
      details: `Generated bill ${billNumber} for ${newBill.packageName}`,
      newStatus: 'Upcoming Trip'
    });

    res.status(201).json({ success: true, message: 'Bill created', data: newBill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ billDate: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: 'Not found' });

    const items = await InvoiceItem.find({ billId: bill._id });
    const payments = await Payment.find({ billId: bill._id }).sort({ date: -1 });

    res.status(200).json({ success: true, data: { ...bill.toObject(), items, payments } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const currentBill = await Bill.findById(req.params.id);
    if (!currentBill) return res.status(404).json({ success: false, message: 'Not found' });

    let items = req.body.items;
    let subtotal = 0;

    if (items && Array.isArray(items)) {
      // Recreate items
      await InvoiceItem.deleteMany({ billId: currentBill._id });
      const invoiceItems = items.map(item => {
        const qty = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        const amt = qty * rate;
        subtotal += amt;
        return {
          billId: currentBill._id,
          description: (item.description && item.description.trim()) ? item.description.trim() : (req.body.packageName || currentBill.packageName || 'Tour Package'),
          quantity: qty,
          rate: rate,
          amount: amt
        };
      });
      if (invoiceItems.length > 0) {
        await InvoiceItem.insertMany(invoiceItems);
      }
    } else {
      subtotal = currentBill.subtotal;
    }

    let discount = req.body.discount !== undefined ? parseFloat(req.body.discount) : currentBill.discount;
    let tax = req.body.tax !== undefined ? parseFloat(req.body.tax) : currentBill.tax;

    let calculatedTotal = subtotal > 0 ? (subtotal - discount + tax) : (req.body.totalAmount !== undefined ? parseFloat(req.body.totalAmount) : currentBill.totalAmount);
    if (calculatedTotal < 0) calculatedTotal = 0;

    let advancePaid = currentBill.advancePaid;
    let dueAmount = calculatedTotal - advancePaid;
    let paymentStatus = advancePaid === 0 ? 'PENDING' : (advancePaid >= calculatedTotal ? 'PAID' : 'PARTIALLY PAID');

    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, {
      ...req.body,
      totalAmount: calculatedTotal,
      subtotal,
      discount,
      tax,
      advancePaid,
      dueAmount,
      paymentStatus
    }, { new: true });

    res.status(200).json({ success: true, message: 'Bill updated', data: updatedBill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    await InvoiceItem.deleteMany({ billId: req.params.id });
    await Payment.deleteMany({ billId: req.params.id });

    // Note: We don't delete the customer, but we can log the deletion if needed.

    res.status(200).json({ success: true, message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
