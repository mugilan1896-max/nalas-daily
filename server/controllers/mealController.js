const db = require('../db/database');

// Get All Meals (with optional category filter)
exports.getMeals = (req, res) => {
  const { category, tag } = req.query;
  let query = 'SELECT * FROM meals WHERE is_available = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category.toLowerCase());
  }

  const meals = db.prepare(query).all(...params);

  const formattedMeals = meals.map(m => ({
    ...m,
    tags: m.tags ? JSON.parse(m.tags) : []
  }));

  if (tag) {
    const filtered = formattedMeals.filter(m => m.tags.includes(tag));
    return res.json({ meals: filtered });
  }

  return res.json({ meals: formattedMeals });
};

// Get Meal by ID
exports.getMealById = (req, res) => {
  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(req.params.id);
  if (!meal) {
    return res.status(404).json({ error: 'Meal not found' });
  }

  return res.json({
    meal: {
      ...meal,
      tags: meal.tags ? JSON.parse(meal.tags) : []
    }
  });
};
