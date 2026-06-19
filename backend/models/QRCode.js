const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['static', 'dynamic'], default: 'static' },
  shortCode: { type: String, default: null },
  fgColor: { type: String, default: '#04162E' },
  bgColor: { type: String, default: '#FFFFFF' },
  size: { type: Number, default: 200 },
  logo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
