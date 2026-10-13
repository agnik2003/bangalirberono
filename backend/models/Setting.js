const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  name: String,
  fullName: String,
  phone: String,
  phoneRaw: String,
  phoneTel: String,
  whatsapp: String,
  email: String,
  rating: String,
  reviews: String,
  address: String,
  youtube: String,
  facebook: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingSchema);
