const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  kyc: { type: mongoose.Schema.Types.ObjectId, ref: 'KYC', unique: true }, // one-to-one
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // one-to-many
});

module.exports = mongoose.model('User', userSchema); 