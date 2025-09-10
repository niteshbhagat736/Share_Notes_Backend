// models/AuditLog.js
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String, // 'upload','download','share','delete'
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
