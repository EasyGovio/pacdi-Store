const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ShortUrl = require('../models/ShortUrl');
const QRCode = require('../models/QRCode');
const User = require('../models/User');
const { nanoid } = require('nanoid');

// Rate limiting middleware (günlük 5 statik QR)
const checkLimit = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const today = new Date().setHours(0,0,0,0);
  const lastReset = new Date(user.lastResetDate).setHours(0,0,0,0);
  if (today > lastReset) {
    user.dailyCount = 0;
    user.lastResetDate = new Date();
    await user.save();
  }
  if (!user.isPro && user.dailyCount >= 5) {
    return res.status(429).json({ error: 'Günlük ücretsiz kotanız doldu. Pro\'ya yükseltin.' });
  }
  next();
};

// Statik QR (sayacı artır)
router.post('/static', auth, checkLimit, async (req, res) => {
  try {
    const { content, fgColor, bgColor, size, logo } = req.body;
    const user = await User.findById(req.user.id);
    user.dailyCount += 1;
    await user.save();

    // QRCode kaydı (opsiyonel)
    const qr = new QRCode({
      userId: req.user.id,
      type: 'static',
      fgColor: fgColor || '#04162E',
      bgColor: bgColor || '#FFFFFF',
      size: size || 200,
      logo: logo || null
    });
    await qr.save();

    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dinamik QR (Pro)
router.post('/dynamic', auth, async (req, res) => {
  try {
    const { destinationUrl, customShortCode, fgColor, bgColor, size, logo } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.isPro) {
      return res.status(403).json({ error: 'Pro aboneliği gereklidir.' });
    }

    const shortCode = customShortCode || nanoid(6);
    const existing = await ShortUrl.findOne({ shortCode });
    if (existing) return res.status(400).json({ error: 'Bu kısa kod zaten kullanılıyor.' });

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

// Kullanıcının QR'larını listeleme
router.get('/list', auth, async (req, res) => {
  try {
    const qrs = await QRCode.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(qrs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dinamik QR güncelleme
router.put('/:id', auth, async (req, res) => {
  try {
    const { destinationUrl } = req.body;
    const qr = await QRCode.findById(req.params.id);
    if (!qr) return res.status(404).json({ error: 'QR bulunamadı.' });
    if (qr.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Yetkisiz.' });
    if (qr.type !== 'dynamic') return res.status(400).json({ error: 'Sadece dinamik QR güncellenebilir.' });

    const short = await ShortUrl.findOne({ shortCode: qr.shortCode });
    if (short) {
      short.destinationUrl = destinationUrl;
      await short.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// QR silme
router.delete('/:id', auth, async (req, res) => {
  try {
    const qr = await QRCode.findById(req.params.id);
    if (!qr) return res.status(404).json({ error: 'QR bulunamadı.' });
    if (qr.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Yetkisiz.' });

    await QRCode.deleteOne({ _id: qr._id });
    if (qr.shortCode) await ShortUrl.deleteOne({ shortCode: qr.shortCode });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
