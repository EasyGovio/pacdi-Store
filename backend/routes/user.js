const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kayıt
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre zorunludur.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email: email.toLowerCase(), password: hashed });
    await user.save();

    const token = jwt.sign(
      { id: user._id, isPro: false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, isPro: false });
  } catch (err) {
    console.error('Register hatası:', err);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu.' });
  }
});

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre zorunludur.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Hatalı şifre.' });
    }

    const token = jwt.sign(
      { id: user._id, isPro: user.isPro },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, isPro: user.isPro });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu.' });
  }
});

// Profil
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profil hatası:', err);
    res.status(500).json({ error: 'Profil getirilemedi.' });
  }
});

// E-posta aboneliği (newsletter)
router.post('/subscribe', async (req, res) => {
  try {
    const { email, purpose, lang } = req.body;
    if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });
    console.log('E-posta aboneliği:', email, purpose, lang);
    // Burada Mailchimp/SendGrid entegrasyonu yapılabilir.
    res.json({ success: true });
  } catch (err) {
    console.error('Abonelik hatası:', err);
    res.status(500).json({ error: 'Abonelik kaydedilemedi.' });
  }
});

module.exports = router;
