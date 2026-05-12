const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { encryptData, hashData } = require('../utils/encryption');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, password, aadhaar, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAadhaar = encryptData(aadhaar);
    const walletAddress = '0x' + crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      aadhaar: encryptedAadhaar,
      phone,
      role: role || 'user',
      walletAddress,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name, email, role: user.role, walletAddress } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};