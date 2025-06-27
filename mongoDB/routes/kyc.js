const express = require('express');
const KYC = require('../models/kyc');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Create or update KYC for user
router.post('/', auth(), async (req, res) => {
  try {
    const { idDocument, address, verificationStatus } = req.body;
    let kyc = await KYC.findOne({ user: req.user.userId });
    if (kyc) {
      // Update
      kyc.idDocument = idDocument;
      kyc.address = address;
      kyc.verificationStatus = verificationStatus || kyc.verificationStatus;
      await kyc.save();
    } else {
      // Create
      kyc = new KYC({ idDocument, address, verificationStatus, user: req.user.userId });
      await kyc.save();
      // Link to user
      await User.findByIdAndUpdate(req.user.userId, { kyc: kyc._id });
    }
    res.json(kyc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get KYC for user
router.get('/', auth(), async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user.userId });
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });
    res.json(kyc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 