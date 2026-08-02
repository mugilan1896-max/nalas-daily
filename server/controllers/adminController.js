const db = require('../db/database');

// Admin Stats
exports.getAdminStats = (req, res) => {
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count;
  const activeSubs = db.prepare("SELECT COUNT(*) as count FROM user_subscriptions WHERE status = 'active'").get().count;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE delivery_date = ?').get(todayStr).count;
  const totalMeals = db.prepare('SELECT COUNT(*) as count FROM meals').get().count;

  return res.json({
    stats: {
      totalUsers,
      activeSubscriptions: activeSubs,
      todayOrders,
      totalMealsInCatalog: totalMeals
    }
  });
};

// Admin List Meals
exports.getAdminMeals = (req, res) => {
  const meals = db.prepare('SELECT * FROM meals ORDER BY category, title').all();
  return res.json({
    meals: meals.map(m => ({
      ...m,
      tags: m.tags ? JSON.parse(m.tags) : []
    }))
  });
};

// Admin Add Meal
exports.addMeal = (req, res) => {
  const { title, category, description, imageUrl, calories, proteinG, carbsG, fatG, tags, price } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const mealId = 'meal_' + Math.random().toString(36).substring(2, 10);

  db.prepare(`
    INSERT INTO meals (id, title, category, description, image_url, calories, protein_g, carbs_g, fat_g, tags, is_available, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    mealId,
    title,
    category.toLowerCase(),
    description || '',
    imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    calories || 400,
    proteinG || 15,
    carbsG || 40,
    fatG || 12,
    JSON.stringify(tags || []),
    price || 199
  );

  return res.json({ message: 'Meal added successfully', mealId });
};

// Admin Toggle / Update Meal Availability
exports.updateMeal = (req, res) => {
  const { id } = req.params;
  const { isAvailable, price, title, description } = req.body;

  db.prepare(`
    UPDATE meals
    SET is_available = COALESCE(?, is_available),
        price = COALESCE(?, price),
        title = COALESCE(?, title),
        description = COALESCE(?, description)
    WHERE id = ?
  `).run(isAvailable !== undefined ? (isAvailable ? 1 : 0) : null, price || null, title || null, description || null, id);

  return res.json({ message: 'Meal updated successfully' });
};

// Admin Delete Meal
exports.deleteMeal = (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM meals WHERE id = ?').run(id);
  return res.json({ message: 'Meal deleted successfully' });
};

// Admin Get All Customer Orders
exports.getAdminOrders = (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, u.full_name as user_name, u.phone_number, a.address_line1, a.city, a.pincode
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN addresses a ON o.address_id = a.id
    ORDER BY o.created_at DESC
  `).all();

  const formattedOrders = orders.map(order => {
    const items = db.prepare(`
      SELECT oi.*, m.title as meal_title
      FROM order_items oi
      JOIN meals m ON oi.meal_id = m.id
      WHERE oi.order_id = ?
    `).all(order.id);

    return { ...order, items };
  });

  return res.json({ orders: formattedOrders });
};

// Admin Update Order Status
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

  return res.json({ message: 'Order status updated successfully' });
};
