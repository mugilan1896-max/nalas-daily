const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

// Send OTP
exports.sendOtp = (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }

  // Developer mode OTP: 123456 or random 6-digit
  const otpCode = '123456';
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const insertOtp = db.prepare(`
    INSERT OR REPLACE INTO otps (phone_number, otp_code, expires_at)
    VALUES (?, ?, ?)
  `);
  insertOtp.run(phoneNumber, otpCode, expiresAt);

  return res.json({
    message: 'OTP sent successfully',
    phoneNumber,
    otpCode // Provided in response for easy testing
  });
};

// Verify OTP & Login
exports.verifyOtp = (req, res) => {
  const { phoneNumber, otpCode } = req.body;
  if (!phoneNumber || !otpCode) {
    return res.status(400).json({ error: 'Phone number and OTP code are required' });
  }

  const otpRow = db.prepare('SELECT * FROM otps WHERE phone_number = ?').get(phoneNumber);
  if (!otpRow || otpRow.otp_code !== otpCode) {
    return res.status(400).json({ error: 'Invalid OTP code' });
  }

  // Check if user exists, else create user
  let user = db.prepare('SELECT * FROM users WHERE phone_number = ?').get(phoneNumber);
  let isNewUser = false;

  if (!user) {
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    const role = phoneNumber === '9999999999' ? 'admin' : 'user';
    db.prepare(`
      INSERT INTO users (id, phone_number, full_name, role, credits)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, phoneNumber, 'Valued Customer', role, 4);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    isNewUser = true;
  }

  // Check if profile exists
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);
  const address = db.prepare('SELECT * FROM addresses WHERE user_id = ?').get(user.id);

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, phoneNumber: user.phone_number, role: user.role },
    process.env.JWT_SECRET || 'nalas_daily_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  // Clear OTP
  db.prepare('DELETE FROM otps WHERE phone_number = ?').run(phoneNumber);

  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      phoneNumber: user.phone_number,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      credits: user.credits
    },
    hasProfile: !!profile,
    hasAddress: !!address,
    isNewUser
  });
};

// Get Current Logged In User details
exports.getMe = (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);
  const address = db.prepare('SELECT * FROM addresses WHERE user_id = ? AND is_default = 1').get(user.id);
  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(user.id);

  return res.json({
    user: {
      id: user.id,
      phoneNumber: user.phone_number,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      credits: user.credits
    },
    profile: profile ? {
      ...profile,
      dietaryPreferences: profile.dietary_preferences ? JSON.parse(profile.dietary_preferences) : [],
      allergies: profile.allergies ? JSON.parse(profile.allergies) : []
    } : null,
    address,
    hasActiveSubscription: !!activeSub
  });
};

// Register with Email/Password
exports.register = async (req, res) => {
  const { email, password, fullName, phoneNumber } = req.body;
  if (!email || !password || !fullName || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR phone_number = ?').get(email, phoneNumber);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email or phone number already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userId = 'user_' + Math.random().toString(36).substring(2, 10);
  const role = phoneNumber === '9999999999' ? 'admin' : 'user';

  db.prepare(`
    INSERT INTO users (id, phone_number, full_name, email, role, credits, password_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, phoneNumber, fullName, email, role, 4, passwordHash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  const token = jwt.sign(
    { userId: user.id, phone: user.phone_number, role: user.role },
    process.env.JWT_SECRET || 'nalas_daily_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Registered successfully',
    token,
    user: {
      id: user.id,
      phoneNumber: user.phone_number,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      credits: user.credits
    },
    isProfileComplete: false
  });
};

// Login with Email/Password
exports.loginEmail = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !user.password_hash) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);
  const address = db.prepare('SELECT * FROM addresses WHERE user_id = ?').get(user.id);

  const token = jwt.sign(
    { userId: user.id, phone: user.phone_number, role: user.role },
    process.env.JWT_SECRET || 'nalas_daily_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      phoneNumber: user.phone_number,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      credits: user.credits
    },
    profile,
    address,
    isProfileComplete: !!(profile && address)
  });
};
