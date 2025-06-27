const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  idDocument: { type: String, required: true },
  address: { type: String, required: true },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true } // one-to-one
});

module.exports = mongoose.model('KYC', kycSchema); 