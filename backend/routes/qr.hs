const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ShortUrl = require('../models/ShortUrl');
const QRCode = require('../models/QRCode');
const { nanoid } = require('nanoid');

// Statik QR (sadece içerik döner)
router.post('/static', (req, res) => {
  const { content } = req.body;
  res.json({ success: true, content });
});

// Dinamik QR (Pro)
router.post('/dynamic', auth, async (req, res) => {
  try {
    const { destinationUrl, customShortCode, fgColor, bgColor, size, logo } = req.body;
    const userId = req.user.id;

    // Pro kontrolü
    const user = await require('../models/User').findById(userId);
    if (!user || !user.isPro) {
      return res.status(403).json({ error: 'Pro aboneliği gereklidir.' });
    }

    // Kısa kod oluştur
    const shortCode = customShortCode || nanoid(6);
    const existing = await ShortUrl.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ error: 'Bu kısa kod zaten kullanılıyor.' });
    }

    const shortUrl = new ShortUrl({
      shortCode,
      destinationUrl,
      userId,
      clicks: 0
    });
    await shortUrl.save();

    const qrRecord = new QRCode({
      userId,
      type: 'dynamic',
      shortCode,
      fgColor: fgColor || '#04162E',
      bgColor: bgColor || '#FFFFFF',
      size: size || 200,
      logo: logo || null
    });
    await qrRecord.save();

    const qrUrl = `${process.env.FRONTEND_URL || 'https://pacdi.store'}/s/${shortCode}`;
    res.json({ success: true, qrUrl, shortCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kullanıcının QR'larını listeleme (Pro)
router.get('/list', auth, async (req, res) => {
  try {
    const qrs = await QRCode.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(qrs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
