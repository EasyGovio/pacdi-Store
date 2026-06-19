const mongoose = require('mongoose');

const ShortUrlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  destinationUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
