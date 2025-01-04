import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../mongodb/models/user.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        imageUrl: profile.photos[0].value,
        tokens: 100, // Inicializar tokens con 30
      });
      await user.save();
      console.log('New user created:', user);
    } else {
      user.imageUrl = profile.photos[0].value;
      await user.save();
      console.log('Existing user found:', user);
    }
    done(null, user);
  } catch (error) {
    console.error('Error in GoogleStrategy:', error);
    done(error, null);
  }
}));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      console.log('User found in JwtStrategy:', user);
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.error('Error in JwtStrategy:', error);
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('User deserialized:', user);
    done(null, user);
  } catch (error) {
    console.error('Error in deserializeUser:', error);
    done(error, null);
  }
});