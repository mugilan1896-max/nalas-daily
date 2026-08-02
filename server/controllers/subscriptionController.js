const db = require('../db/database');

// Get All Subscription Plans Master List
exports.getPlans = (req, res) => {
  const plans = db.prepare('SELECT * FROM subscription_plans').all();
  return res.json({ plans });
};

// Get User's Active Subscription
exports.getCurrentSubscription = (req, res) => {
  const userId = req.user.userId;
  const sub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active' ORDER BY start_date DESC").get(userId);

  if (!sub) {
    return res.json({ subscription: null });
  }

  const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(sub.plan_id);
  const user = db.prepare('SELECT credits FROM users WHERE id = ?').get(userId);

  return res.json({
    subscription: {
      ...sub,
      mealTypes: sub.meal_types ? JSON.parse(sub.meal_types) : [],
      planDetails: plan,
      userCredits: user ? user.credits : 0
    }
  });
};

// Subscribe / Purchase Plan
exports.subscribe = (req, res) => {
  const { planId, mealTypes } = req.body;
  if (!planId || !mealTypes || !Array.isArray(mealTypes) || mealTypes.length === 0) {
    return res.status(400).json({ error: 'Plan ID and at least one meal type are required' });
  }

  const userId = req.user.userId;
  const plan = db.prepare('SELECT * FROM subscription_plans WHERE id = ?').get(planId);
  if (!plan) {
    return res.status(404).json({ error: 'Subscription plan not found' });
  }

  // Deactivate any existing active subscriptions
  db.prepare("UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'").run(userId);

  const subId = 'sub_' + Math.random().toString(36).substring(2, 10);
  const startDate = new Date().toISOString().split('T')[0];
  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() + plan.duration_days);
  const endDate = endDateObj.toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO user_subscriptions (id, user_id, plan_id, status, start_date, end_date, renewal_date, meal_types)
    VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
  `).run(subId, userId, planId, startDate, endDate, endDate, JSON.stringify(mealTypes));

  // Add credits to user account
  if (plan.credits_included > 0) {
    db.prepare('UPDATE users SET credits = credits + ? WHERE id = ?').run(plan.credits_included, userId);
  }

  // Log activity
  db.prepare('INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)')
    .run('log_' + Math.random().toString(36).substring(2, 10), userId, 'SUBSCRIPTION_CREATED', `Subscribed to ${plan.name}`);

  return res.json({ message: 'Subscribed successfully', subscriptionId: subId });
};

// Pause Subscription
exports.pauseSubscription = (req, res) => {
  const userId = req.user.userId;
  const sub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);

  if (!sub) {
    return res.status(404).json({ error: 'No active subscription found to pause' });
  }

  db.prepare("UPDATE user_subscriptions SET status = 'paused' WHERE id = ?").run(sub.id);

  db.prepare('INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)')
    .run('log_' + Math.random().toString(36).substring(2, 10), userId, 'SUBSCRIPTION_PAUSED', 'Paused active subscription');

  return res.json({ message: 'Subscription paused successfully' });
};

// Resume Subscription
exports.resumeSubscription = (req, res) => {
  const userId = req.user.userId;
  const sub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'paused'").get(userId);

  if (!sub) {
    return res.status(404).json({ error: 'No paused subscription found to resume' });
  }

  db.prepare("UPDATE user_subscriptions SET status = 'active' WHERE id = ?").run(sub.id);

  db.prepare('INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)')
    .run('log_' + Math.random().toString(36).substring(2, 10), userId, 'SUBSCRIPTION_RESUMED', 'Resumed subscription');

  return res.json({ message: 'Subscription resumed successfully' });
};
