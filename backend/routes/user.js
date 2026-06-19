const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kayıt
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id, isPro: false }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, isPro: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Hatalı şifre.' });

    const token = jwt.sign(
      { id: user._id, isPro: user.isPro },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, isPro: user.isPro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profil (token ile)
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// E-posta aboneliği (newsletter)
router.post('/subscribe', async (req, res) => {
  const { email, purpose, lang } = req.body;
  // Burada Mailchimp veya benzeri servise ekleyebilirsiniz.
  console.log('E-posta aboneliği:', email, purpose, lang);
  res.json({ success: true });
});

module.exports = router;
