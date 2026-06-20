require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const geoip = require('geoip-lite');
const useragent = require('useragent');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB hatası:', err));

// Route'lar
app.use('/api/user', require('./routes/user'));
app.use('/api/qr', require('./routes/qr'));
app.use('/api/subscription', require('./routes/subscription'));

// Webhook
app.post('/webhook/paddle', require('./webhook'));

// Modeller
const ShortUrl = require('./models/ShortUrl');
const Analytics = require('./models/Analytics');

// Dinamik yönlendirme + analitik
app.get('/s/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const record = await ShortUrl.findOne({ shortCode });
    if (!record) return res.status(404).send('Kısa URL bulunamadı.');

    // Analitik kaydı
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const ua = useragent.parse(req.headers['user-agent']);
    await Analytics.create({
      shortCode,
      country: geo?.country || 'Bilinmiyor',
      browser: ua.family,
      device: ua.device.family || 'Bilgisayar',
      ip
    });

    record.clicks += 1;
    await record.save();
    res.redirect(record.destinationUrl);
  } catch (err) {
    console.error('Yönlendirme hatası:', err);
    res.status(500).send('Sunucu hatası');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda çalışıyor.`));
