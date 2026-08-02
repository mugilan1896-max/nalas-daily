const db = require('../db/database');

// Get User Orders
exports.getOrders = (req, res) => {
  const userId = req.user.userId;

  const orders = db.prepare(`
    SELECT o.*, a.address_line1, a.city, a.pincode
    FROM orders o
    JOIN addresses a ON o.address_id = a.id
    WHERE o.user_id = ?
    ORDER BY o.delivery_date DESC, o.created_at DESC
  `).all(userId);

  const formattedOrders = orders.map(order => {
    const items = db.prepare(`
      SELECT oi.*, m.title as meal_title, m.image_url as meal_image_url, m.calories
      FROM order_items oi
      JOIN meals m ON oi.meal_id = m.id
      WHERE oi.order_id = ?
    `).all(order.id);

    return {
      ...order,
      items
    };
  });

  return res.json({ orders: formattedOrders });
};

// Get Today's Delivery Breakdown for User Dashboard
exports.getTodayDeliveries = (req, res) => {
  const userId = req.user.userId;
  const todayStr = new Date().toISOString().split('T')[0];
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayName = dayNames[new Date().getDay()];

  // Get current week Monday
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const weekStart = d.toISOString().split('T')[0];

  const todaysPlan = db.prepare(`
    SELECT wp.*, m.title as meal_title, m.category as meal_category, m.image_url as meal_image_url
    FROM weekly_plans wp
    JOIN meals m ON wp.meal_id = m.id
    WHERE wp.user_id = ? AND wp.week_start_date = ? AND wp.day_of_week = ?
  `).all(userId, weekStart, currentDayName);

  return res.json({
    date: todayStr,
    dayName: currentDayName,
    deliveries: todaysPlan
  });
};

// Order Extra Meal
exports.orderExtraMeal = (req, res) => {
  const userId = req.user.userId;
  const { mealId, deliveryTimeSlot, addressId } = req.body;

  if (!mealId || !addressId) {
    return res.status(400).json({ error: 'Meal ID and Delivery Address ID are required' });
  }

  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(mealId);
  if (!meal) {
    return res.status(404).json({ error: 'Meal not found' });
  }

  const user = db.prepare('SELECT credits FROM users WHERE id = ?').get(userId);
  if (user.credits < 1) {
    return res.status(400).json({ error: 'Insufficient credits. Please top up or renew your plan.' });
  }

  // Deduct 1 credit
  db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);

  const orderId = 'ord_' + Math.random().toString(36).substring(2, 10);
  const orderNumber = 'ND-' + Math.floor(100000 + Math.random() * 900000);
  const todayStr = new Date().toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO orders (id, order_number, user_id, delivery_date, delivery_time_slot, status, address_id, total_amount)
    VALUES (?, ?, ?, ?, ?, 'preparing', ?, ?)
  `).run(orderId, orderNumber, userId, todayStr, deliveryTimeSlot || '8:00 AM', addressId, meal.price);

  db.prepare(`
    INSERT INTO order_items (id, order_id, meal_id, meal_type, quantity)
    VALUES (?, ?, ?, ?, 1)
  `).run('item_' + Math.random().toString(36).substring(2, 10), orderId, mealId, meal.category);

  db.prepare('INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)')
    .run('log_' + Math.random().toString(36).substring(2, 10), userId, 'EXTRA_MEAL_ORDERED', `Ordered extra meal (${meal.title}) using 1 credit.`);

  return res.json({ message: 'Extra meal ordered successfully', orderNumber });
};
