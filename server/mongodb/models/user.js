// server/mongodb/models/user.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  tokens: { type: Number, required: true, default: 100 },
});

const User = mongoose.model('User', UserSchema);

export default User;
