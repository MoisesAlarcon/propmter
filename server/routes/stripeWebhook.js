import Stripe from 'stripe';
import express from 'express';
import User from '../mongodb/models/user.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Manejar los eventos de Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id; // Recuperar el ID de usuario de los metadatos

        if (!userId) {
          console.log('User ID not found in metadata');
          return res.status(400).send('User ID not found in metadata');
        }

        // Actualizar los tokens del usuario
        const user = await User.findById(userId);
        if (user) {
          user.tokens += 1000;
          await user.save();
          console.log(`Tokens updated for user ${user._id}`);

          // Emitir un evento a través de socket.io
          const io = req.app.get('socketio');
          io.emit('tokensUpdated', { userId: user._id, tokens: user.tokens });
        } else {
          console.log(`User not found for ID: ${userId}`);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;