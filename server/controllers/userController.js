const db = require('../db/database');

// Get Profile
exports.getProfile = (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.userId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json({
    profile: {
      ...profile,
      dietaryPreferences: profile.dietary_preferences ? JSON.parse(profile.dietary_preferences) : [],
      allergies: profile.allergies ? JSON.parse(profile.allergies) : []
    }
  });
};

// Save/Update Profile
exports.saveProfile = (req, res) => {
  const { petName, petType, breed, ageYears, weightKg, dietaryPreferences, allergies, fullName, email } = req.body;
  if (!petName) {
    return res.status(400).json({ error: 'Pet or User name is required' });
  }

  const userId = req.user.userId;

  // Update user name/email if provided
  if (fullName || email) {
    db.prepare('UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email) WHERE id = ?')
      .run(fullName, email, userId);
  }

  const existingProfile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  const profileId = existingProfile ? existingProfile.id : 'prof_' + Math.random().toString(36).substring(2, 10);

  const insertOrUpdate = db.prepare(`
    INSERT OR REPLACE INTO profiles (id, user_id, pet_name, pet_type, breed, age_years, weight_kg, dietary_preferences, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOrUpdate.run(
    profileId,
    userId,
    petName,
    petType || 'dog',
    breed || '',
    ageYears || 1,
    weightKg || 10,
    JSON.stringify(dietaryPreferences || []),
    JSON.stringify(allergies || [])
  );

  return res.json({ message: 'Profile saved successfully', profileId });
};

// Get Addresses
exports.getAddresses = (req, res) => {
  const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC').all(req.user.userId);
  return res.json({ addresses });
};

// Add Address
exports.addAddress = (req, res) => {
  const { addressLine1, addressLine2, city, pincode, deliveryInstructions, isDefault } = req.body;
  if (!addressLine1 || !city || !pincode) {
    return res.status(400).json({ error: 'Address line 1, city, and pincode are required' });
  }

  const userId = req.user.userId;
  const addressId = 'addr_' + Math.random().toString(36).substring(2, 10);

  if (isDefault) {
    db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
  }

  db.prepare(`
    INSERT INTO addresses (id, user_id, address_line1, address_line2, city, pincode, delivery_instructions, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(addressId, userId, addressLine1, addressLine2 || '', city, pincode, deliveryInstructions || '', isDefault ? 1 : 1);

  return res.json({ message: 'Address added successfully', addressId });
};

// Set Default Address
exports.setDefaultAddress = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
  db.prepare('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?').run(id, userId);

  return res.json({ message: 'Default address updated' });
};
