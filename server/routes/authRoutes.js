import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../mongodb/models/user.js';

dotenv.config();

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      googleId: req.user.googleId,
      imageUrl: req.user.imageUrl || '',
      tokens: req.user.tokens,
    };
    res.redirect(`${process.env.FRONTEND_BASE_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('Error during Google callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export default router;
