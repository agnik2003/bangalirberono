const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  age: { type: String },
  gender: { type: String },
  locationFrom: { type: String },
  heads: { type: Number },
  postpaidNumber: { type: String },
  downTrainFlight: { type: String },
  room: { type: String },
  packageName: { type: String },
  status: { 
    type: String, 
    enum: ['Enquired', 'Upcoming Trip', 'Completed Trip'], 
    default: 'Enquired' 
  },
  interactions: [{
    type: { type: String, enum: ['Enquiry', 'Booking', 'Bill', 'Manual'] },
    date: { type: Date, default: Date.now },
    details: { type: String }
  }]
}, { timestamps: true });

// Create a compound index so we can efficiently query by name+phone
customerSchema.index({ name: 1, phone: 1 });

module.exports = mongoose.model('Customer', customerSchema);
