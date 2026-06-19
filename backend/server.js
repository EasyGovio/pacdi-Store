require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Route'lar
app.use('/api/user', require('./routes/user'));
app.use('/api/qr', require('./routes/qr'));
app.use('/api/subscription', require('./routes/subscription'));

// Paddle webhook
app.post('/webhook/paddle', require('./webhook'));

// Dinamik yönlendirme
const ShortUrl = require('./models/ShortUrl');
app.get('/s/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const record = await ShortUrl.findOne({ shortCode });
    if (record) {
      record.clicks += 1;
      await record.save();
      return res.redirect(record.destinationUrl);
    }
    res.status(404).send('Kısa URL bulunamadı.');
  } catch (err) {
    res.status(500).send('Sunucu hatası');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda çalışıyor.`));
