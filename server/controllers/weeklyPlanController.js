const db = require('../db/database');

// Helper to calculate Monday date of current/given week
const getWeekStartDate = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

// Get Weekly Plan for User
exports.getWeeklyPlan = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate } = req.query;
  const targetWeek = getWeekStartDate(weekStartDate);

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);

  // Get allowed meal types from subscription
  let activeSubMealTypes = ['breakfast', 'lunch', 'dinner'];
  if (activeSub && activeSub.meal_types) {
    try {
      activeSubMealTypes = JSON.parse(activeSub.meal_types);
    } catch (e) { /* fallback to all */ }
  }

  const selections = db.prepare(`
    SELECT wp.*, m.title as meal_title, m.category as meal_category, m.image_url as meal_image_url,
           m.calories, m.protein_g, m.carbs_g, m.fat_g, m.price as meal_price
    FROM weekly_plans wp
    LEFT JOIN meals m ON wp.meal_id = m.id
    WHERE wp.user_id = ? AND wp.week_start_date = ?
  `).all(userId, targetWeek);

  // Calculate total nutrients for selected meals (only those with actual meals)
  const summary = selections.reduce((acc, curr) => {
    if (curr.meal_id) {
      acc.totalCalories += curr.calories || 0;
      acc.totalProtein += curr.protein_g || 0;
      acc.totalCarbs += curr.carbs_g || 0;
      acc.totalFat += curr.fat_g || 0;
    }
    acc.selectedCount += 1;
    return acc;
  }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, selectedCount: 0 });

  return res.json({
    weekStartDate: targetWeek,
    hasSubscription: !!activeSub,
    activeSubMealTypes,
    summary,
    selections
  });
};

// Save / Update Single Meal Selection (as draft)
exports.selectMeal = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate, dayOfWeek, mealType, mealId } = req.body;

  if (!dayOfWeek || !mealType || !mealId) {
    return res.status(400).json({ error: 'dayOfWeek, mealType, and mealId are required' });
  }

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);
  if (!activeSub) {
    return res.status(400).json({ error: 'Active subscription required to select meals' });
  }

  // Enforce meal type restriction
  const allowedTypes = JSON.parse(activeSub.meal_types || '["breakfast","lunch","dinner"]');
  if (!allowedTypes.includes(mealType.toLowerCase())) {
    return res.status(403).json({ error: `Your plan does not include ${mealType}. Allowed: ${allowedTypes.join(', ')}` });
  }

  const targetWeek = getWeekStartDate(weekStartDate);
  const planId = 'wp_' + Math.random().toString(36).substring(2, 10);

  const insertOrUpdate = db.prepare(`
    INSERT INTO weekly_plans (id, user_id, subscription_id, week_start_date, day_of_week, meal_type, meal_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
    ON CONFLICT(user_id, week_start_date, day_of_week, meal_type)
    DO UPDATE SET meal_id = excluded.meal_id, status = 'draft'
  `);

  insertOrUpdate.run(planId, userId, activeSub.id, targetWeek, dayOfWeek.toLowerCase(), mealType.toLowerCase(), mealId);

  return res.json({ message: 'Meal selection saved as draft' });
};

// Skip a single meal slot
exports.skipMeal = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate, dayOfWeek, mealType } = req.body;

  if (!dayOfWeek || !mealType) {
    return res.status(400).json({ error: 'dayOfWeek and mealType are required' });
  }

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);
  if (!activeSub) {
    return res.status(400).json({ error: 'Active subscription required' });
  }

  const targetWeek = getWeekStartDate(weekStartDate);
  const planId = 'wp_' + Math.random().toString(36).substring(2, 10);

  db.prepare(`
    INSERT INTO weekly_plans (id, user_id, subscription_id, week_start_date, day_of_week, meal_type, meal_id, status)
    VALUES (?, ?, ?, ?, ?, ?, NULL, 'skipped')
    ON CONFLICT(user_id, week_start_date, day_of_week, meal_type)
    DO UPDATE SET meal_id = NULL, status = 'skipped'
  `).run(planId, userId, activeSub.id, targetWeek, dayOfWeek.toLowerCase(), mealType.toLowerCase());

  return res.json({ message: `${mealType} on ${dayOfWeek} skipped` });
};

// Pause an entire day (skip all allowed meal types for that day)
exports.pauseDay = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate, dayOfWeek } = req.body;

  if (!dayOfWeek) {
    return res.status(400).json({ error: 'dayOfWeek is required' });
  }

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);
  if (!activeSub) {
    return res.status(400).json({ error: 'Active subscription required' });
  }

  const targetWeek = getWeekStartDate(weekStartDate);
  const subMealTypes = JSON.parse(activeSub.meal_types || '["breakfast","lunch","dinner"]');

  const stmt = db.prepare(`
    INSERT INTO weekly_plans (id, user_id, subscription_id, week_start_date, day_of_week, meal_type, meal_id, status)
    VALUES (?, ?, ?, ?, ?, ?, NULL, 'paused')
    ON CONFLICT(user_id, week_start_date, day_of_week, meal_type)
    DO UPDATE SET meal_id = NULL, status = 'paused'
  `);

  subMealTypes.forEach(mealType => {
    const planId = 'wp_' + Math.random().toString(36).substring(2, 10);
    stmt.run(planId, userId, activeSub.id, targetWeek, dayOfWeek.toLowerCase(), mealType);
  });

  return res.json({ message: `${dayOfWeek} paused — no meals will be delivered` });
};

// Confirm the entire week (draft -> scheduled)
exports.confirmWeek = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate } = req.body;
  const targetWeek = getWeekStartDate(weekStartDate);

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);
  if (!activeSub) {
    return res.status(400).json({ error: 'Active subscription required' });
  }

  const result = db.prepare(`
    UPDATE weekly_plans SET status = 'scheduled'
    WHERE user_id = ? AND week_start_date = ? AND status = 'draft'
  `).run(userId, targetWeek);

  return res.json({ message: `Week confirmed. ${result.changes} meals scheduled.`, confirmedCount: result.changes });
};

// Auto-fill unselected slots
exports.autoFillWeeklyPlan = (req, res) => {
  const userId = req.user.userId;
  const { weekStartDate } = req.body;
  const targetWeek = getWeekStartDate(weekStartDate);

  const activeSub = db.prepare("SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'").get(userId);
  if (!activeSub) {
    return res.status(400).json({ error: 'Active subscription required' });
  }

  const subMealTypes = JSON.parse(activeSub.meal_types || '["breakfast", "dinner"]');
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const allMeals = db.prepare('SELECT * FROM meals WHERE is_available = 1').all();

  days.forEach(day => {
    subMealTypes.forEach(mealType => {
      const existing = db.prepare(`
        SELECT * FROM weekly_plans
        WHERE user_id = ? AND week_start_date = ? AND day_of_week = ? AND meal_type = ?
      `).get(userId, targetWeek, day, mealType);

      if (!existing) {
        const categoryMeals = allMeals.filter(m => m.category === mealType);
        if (categoryMeals.length > 0) {
          const randomMeal = categoryMeals[Math.floor(Math.random() * categoryMeals.length)];
          db.prepare(`
            INSERT INTO weekly_plans (id, user_id, subscription_id, week_start_date, day_of_week, meal_type, meal_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
          `).run('wp_' + Math.random().toString(36).substring(2, 10), userId, activeSub.id, targetWeek, day, mealType, randomMeal.id);
        }
      }
    });
  });

  return res.json({ message: 'Weekly plan auto-filled successfully' });
};
