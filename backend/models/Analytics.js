const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, index: true },
  country: { type: String, default: 'Bilinmiyor' },
  browser: { type: String, default: 'Bilinmiyor' },
  device: { type: String, default: 'Bilinmiyor' },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
