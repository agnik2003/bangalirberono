const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
  adminId: {
    type: String,
    default: 'admin',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically expire session documents after 24 hours (TTL index in MongoDB)
  }
});

module.exports = mongoose.model('AdminSession', adminSessionSchema);
