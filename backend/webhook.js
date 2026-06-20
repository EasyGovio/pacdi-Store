const User = require('./models/User');

module.exports = async (req, res) => {
  try {
    const event = req.body;
    if (event.event_type === 'subscription_created' || event.event_type === 'subscription_updated') {
      const email = event.data.customer_email;
      const user = await User.findOne({ email });
      if (user) {
        user.isPro = true;
        user.proExpiry = new Date(event.data.next_billed_at);
        user.paddleSubscriptionId = event.data.subscription_id;
        await user.save();
      }
    } else if (event.event_type === 'subscription_cancelled') {
      const email = event.data.customer_email;
      const user = await User.findOne({ email });
      if (user) {
        user.isPro = false;
        await user.save();
      }
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook hatası:', err);
    res.status(500).send('Hata');
  }
};
