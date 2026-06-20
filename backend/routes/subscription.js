const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

router.post('/create', auth, async (req, res) => {
  try {
    const { priceId } = req.body;
    const user = await User.findById(req.user.id);

    const response = await axios.post('https://api.paddle.com/subscriptions', {
      price_id: priceId,
      customer_email: user.email,
      // Diğer gerekli alanlar...
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ checkoutUrl: response.data.data.checkout_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
