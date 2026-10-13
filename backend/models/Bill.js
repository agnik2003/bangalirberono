const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: String,
  packageName: String,
  packageCategory: String,
  packageExperience: String,
  travelDate: String,
  travellers: Number,
  totalAmount: { type: Number, required: true },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 }, // Represents Total Paid
  dueAmount: { type: Number, default: 0 }, // Represents Balance Due
  paymentStatus: { type: String, default: 'PENDING' },
  billDate: { type: Date, default: Date.now },
  billNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Bill', billSchema);
