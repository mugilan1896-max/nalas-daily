const db = require('./database');
const { v4: uuidv4 } = require('crypto');

console.log('Seeding database with initial data...');

// 1. Seed Subscription Plans
const plans = [
  // Individual Plans
  {
    id: 'plan_ind_breakfast',
    name: 'Breakfast Only',
    code: 'IND_BREAKFAST',
    description: 'A fresh, hot breakfast delivered to your door every morning.',
    price_per_day: 110,
    meals_per_day: 1,
    duration_days: 1,
    credits_included: 0,
    plan_type: 'individual',
    meal_label: 'Breakfast',
    total_price: 110,
    is_popular: 0,
    badge: null
  },
  {
    id: 'plan_ind_lunch',
    name: 'Lunch Only',
    code: 'IND_LUNCH',
    description: 'Wholesome home-cooked lunch, straight to your workplace.',
    price_per_day: 149,
    meals_per_day: 1,
    duration_days: 1,
    credits_included: 0,
    plan_type: 'individual',
    meal_label: 'Lunch',
    total_price: 149,
    is_popular: 0,
    badge: null
  },
  {
    id: 'plan_ind_dinner',
    name: 'Dinner Only',
    code: 'IND_DINNER',
    description: 'A warm, comforting dinner to end your day right.',
    price_per_day: 139,
    meals_per_day: 1,
    duration_days: 1,
    credits_included: 0,
    plan_type: 'individual',
    meal_label: 'Dinner',
    total_price: 139,
    is_popular: 0,
    badge: null
  },
  // Weekly Plans (matches Stitch design)
  {
    id: 'plan_weekly_bd',
    name: 'Breakfast & Dinner',
    code: 'WEEKLY_BD',
    description: 'Perfect for busy mornings and relaxed evenings.',
    price_per_day: 100,
    meals_per_day: 2,
    duration_days: 6,
    credits_included: 2,
    plan_type: 'weekly',
    meal_label: 'Breakfast & Dinner',
    total_price: 600,
    is_popular: 0,
    badge: '6 Days'
  },
  {
    id: 'plan_weekly_all',
    name: 'All Meals',
    code: 'WEEKLY_ALL',
    description: 'Breakfast, Lunch and Dinner covered.',
    price_per_day: 210,
    meals_per_day: 3,
    duration_days: 6,
    credits_included: 4,
    plan_type: 'weekly',
    meal_label: 'All Meals',
    total_price: 1260,
    is_popular: 1,
    badge: '6 Days'
  },
  {
    id: 'plan_weekly_lunch_veg',
    name: 'Lunch Veg',
    code: 'WEEKLY_LUNCH_VEG',
    description: 'Healthy, home-style vegetarian lunches.',
    price_per_day: 110,
    meals_per_day: 1,
    duration_days: 6,
    credits_included: 1,
    plan_type: 'weekly',
    meal_label: 'Lunch Veg',
    total_price: 660,
    is_popular: 0,
    badge: '6 Days'
  },
  // Monthly Plans
  {
    id: 'plan_monthly_lunch',
    name: 'Monthly Lunch',
    code: 'MONTHLY_LUNCH',
    description: 'Daily vegetarian lunches for the entire month.',
    price_per_day: 99,
    meals_per_day: 1,
    duration_days: 26,
    credits_included: 4,
    plan_type: 'monthly',
    meal_label: 'Lunch Only',
    total_price: 2574,
    is_popular: 0,
    badge: '26 Days'
  },
  {
    id: 'plan_monthly_bd',
    name: 'Monthly Breakfast & Dinner',
    code: 'MONTHLY_BD',
    description: 'Start and end every day with a wholesome meal.',
    price_per_day: 180,
    meals_per_day: 2,
    duration_days: 26,
    credits_included: 6,
    plan_type: 'monthly',
    meal_label: 'Breakfast & Dinner',
    total_price: 4680,
    is_popular: 1,
    badge: '26 Days'
  },
  {
    id: 'plan_monthly_all',
    name: 'Monthly Full Board',
    code: 'MONTHLY_ALL',
    description: 'Complete nutrition with all 3 meals daily.',
    price_per_day: 280,
    meals_per_day: 3,
    duration_days: 26,
    credits_included: 8,
    plan_type: 'monthly',
    meal_label: 'All Meals',
    total_price: 7280,
    is_popular: 0,
    badge: '26 Days'
  }
];

const insertPlan = db.prepare(`
  INSERT OR REPLACE INTO subscription_plans (id, name, code, description, price_per_day, meals_per_day, duration_days, credits_included, plan_type, meal_label, total_price, is_popular, badge)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

plans.forEach(plan => {
  insertPlan.run(
    plan.id, plan.name, plan.code, plan.description,
    plan.price_per_day, plan.meals_per_day, plan.duration_days, plan.credits_included,
    plan.plan_type, plan.meal_label, plan.total_price, plan.is_popular, plan.badge
  );
});

// 2. Seed Meals Catalog
const meals = [
  // BREAKFAST
  { id: 'b_idly', title: 'Idly (4 Nos)', category: 'breakfast', description: 'Soft, fluffy steamed rice cakes served with sambar and coconut chutney.', image_url: '/menu/menu_idly.png', calories: 250, protein_g: 8.0, carbs_g: 50.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Gluten-Free']), is_available: 1, price: 50 },
  { id: 'b_dosai', title: 'Dosai (3 Nos)', category: 'breakfast', description: 'Crispy golden crepes served with sambar and chutney.', image_url: '/menu/menu_dosai.png', calories: 300, protein_g: 7.0, carbs_g: 45.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_pongal', title: 'Pongal (1 No)', category: 'breakfast', description: 'Savory rice and lentil porridge seasoned with black pepper and cumin.', image_url: '/menu/menu_pongal.png', calories: 350, protein_g: 12.0, carbs_g: 60.0, fat_g: 15.0, tags: JSON.stringify(['Vegetarian', 'Comfort Food']), is_available: 1, price: 50 },
  { id: 'b_poori', title: 'Poori (3 Nos)', category: 'breakfast', description: 'Deep-fried Indian bread served with spiced potato curry.', image_url: '/menu/menu_poori.png', calories: 450, protein_g: 6.0, carbs_g: 55.0, fat_g: 20.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_chapathi', title: 'Chapathi (3 Nos)', category: 'breakfast', description: 'Soft whole wheat flatbreads served with vegetable kurma.', image_url: '/hero_slide_5.png', calories: 300, protein_g: 9.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'High Fiber']), is_available: 1, price: 50 },
  { id: 'b_kichadi', title: 'Kichadi (1 No)', category: 'breakfast', description: 'Savory semolina dish cooked with vegetables and mild spices.', image_url: '/vegmeal.jpg.png', calories: 280, protein_g: 6.0, carbs_g: 40.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_aappam', title: 'Aappam (3 Nos)', category: 'breakfast', description: 'Lace hoppers with a soft center and crispy edges, served with coconut milk.', image_url: '/hero_slide_5.png', calories: 240, protein_g: 4.0, carbs_g: 52.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Gluten-Free']), is_available: 1, price: 50 },
  { id: 'b_kuzhi', title: 'Kuzhi Paniyaram (5 Nos)', category: 'breakfast', description: 'Crispy savory dumplings made from fermented batter.', image_url: '/vegmeal_dpt.jpg.png', calories: 320, protein_g: 7.0, carbs_g: 55.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },

  // LUNCH
  { id: 'l_meals', title: 'Meals', category: 'lunch', description: 'Traditional South Indian vegetarian full meal served on a banana leaf.', image_url: '/hero_thali_platter.png', calories: 600, protein_g: 18.0, carbs_g: 90.0, fat_g: 15.0, tags: JSON.stringify(['Vegetarian', 'Full Meal']), is_available: 1, price: 110 },
  { id: 'l_nonveg_meals', title: 'Non Veg Meals', category: 'lunch', description: 'Authentic South Indian non-vegetarian full meal with chicken or fish curry.', image_url: '/3d_nonveg_platter.png', calories: 750, protein_g: 35.0, carbs_g: 85.0, fat_g: 25.0, tags: JSON.stringify(['Non-Veg', 'High Protein', 'Full Meal']), is_available: 1, price: 150 },
  { id: 'l_malli', title: 'Malli Rice', category: 'lunch', description: 'Fragrant rice flavored with fresh coriander leaves and spices.', image_url: '/nonveg_rice.jpg.png', calories: 350, protein_g: 6.0, carbs_g: 60.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_kovakai', title: 'Kovakai Rice', category: 'lunch', description: 'Stir-fried ivy gourd mixed with seasoned rice.', image_url: '/vegmeal.jpg.png', calories: 380, protein_g: 7.0, carbs_g: 65.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_coconut', title: 'Coconut Rice', category: 'lunch', description: 'Rice cooked with freshly grated coconut and tempered with cashews.', image_url: '/vegmeal_dpt.jpg.png', calories: 420, protein_g: 5.0, carbs_g: 60.0, fat_g: 18.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_tomato', title: 'Tomato Rice', category: 'lunch', description: 'Tangy and spicy rice cooked with ripe tomatoes and herbs.', image_url: '/hero_slide_3.png', calories: 360, protein_g: 6.0, carbs_g: 65.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_lemon', title: 'Lemon Rice', category: 'lunch', description: 'Zesty lemon-flavored rice tempered with peanuts and mustard seeds.', image_url: '/hero_slide_2.png', calories: 370, protein_g: 6.0, carbs_g: 65.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_curd', title: 'Curd Rice', category: 'lunch', description: 'Cooling yogurt rice tempered with mustard, curry leaves, and pomegranate.', image_url: '/hero_slide_5.png', calories: 310, protein_g: 8.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'Cooling']), is_available: 1, price: 70 },
  { id: 'l_pudina', title: 'Pudina Rice', category: 'lunch', description: 'Mint-flavored rice blended with aromatic spices.', image_url: '/nonveg_rice.jpg.png', calories: 340, protein_g: 6.0, carbs_g: 60.0, fat_g: 9.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_puliyotharai', title: 'Puliyotharai Rice', category: 'lunch', description: 'Traditional tangy tamarind rice mixed with peanuts and spices.', image_url: '/hero_slide_4.png', calories: 400, protein_g: 7.0, carbs_g: 70.0, fat_g: 14.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_vegbiryani', title: 'Veg Biryani', category: 'lunch', description: 'Aromatic basmati rice cooked with mixed vegetables and rich spices.', image_url: '/nonveg_briyani.jpg.png', calories: 450, protein_g: 10.0, carbs_g: 75.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 80 },

  // DINNER
  { id: 'd_idly', title: 'Idly (4 Nos)', category: 'dinner', description: 'Soft, fluffy steamed rice cakes served with sambar and coconut chutney.', image_url: '/menu/menu_idly.png', calories: 250, protein_g: 8.0, carbs_g: 50.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Light Dinner']), is_available: 1, price: 50 },
  { id: 'd_dosai', title: 'Dosai (3 Nos)', category: 'dinner', description: 'Crispy golden crepes served with sambar and chutney.', image_url: '/menu/menu_dosai.png', calories: 300, protein_g: 7.0, carbs_g: 45.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'd_chapathi', title: 'Chapathi (3 Nos)', category: 'dinner', description: 'Soft whole wheat flatbreads served with vegetable kurma.', image_url: '/hero_slide_5.png', calories: 300, protein_g: 9.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'High Fiber']), is_available: 1, price: 50 },
  { id: 'd_kichadi', title: 'Kichadi (1 No)', category: 'dinner', description: 'Savory semolina dish cooked with vegetables and mild spices.', image_url: '/vegmeal.jpg.png', calories: 280, protein_g: 6.0, carbs_g: 40.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 }
];

db.prepare('PRAGMA foreign_keys = OFF').run();
db.prepare('DELETE FROM meals').run();
db.prepare('PRAGMA foreign_keys = ON').run();

const insertMeal = db.prepare(`
  INSERT INTO meals (id, title, category, description, image_url, calories, protein_g, carbs_g, fat_g, tags, is_available, price)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

meals.forEach(m => {
  insertMeal.run(
    m.id, m.title, m.category, m.description, m.image_url,
    m.calories, m.protein_g, m.carbs_g, m.fat_g, m.tags, m.is_available, m.price
  );
});

// 3. Seed Demo Users (1 Demo User + 1 Admin User)
const users = [
  {
    id: 'user_demo_nala',
    phone_number: '9876543210',
    full_name: 'Nala Gourmet',
    email: 'nala@nalasdaily.com',
    role: 'user',
    credits: 4
  },
  {
    id: 'user_admin',
    phone_number: '9999999999',
    full_name: 'System Admin',
    email: 'admin@nalasdaily.com',
    role: 'admin',
    credits: 100
  }
];

const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, phone_number, full_name, email, role, credits)
  VALUES (?, ?, ?, ?, ?, ?)
`);

users.forEach(u => {
  insertUser.run(u.id, u.phone_number, u.full_name, u.email, u.role, u.credits);
});

// 4. Seed Demo User Profile
const insertProfile = db.prepare(`
  INSERT OR REPLACE INTO profiles (id, user_id, pet_name, pet_type, breed, age_years, weight_kg, dietary_preferences, allergies)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertProfile.run(
  'profile_demo_1',
  'user_demo_nala',
  'Nala',
  'dog',
  'Golden Retriever',
  3,
  24.5,
  JSON.stringify(['Grain-Free', 'High Protein', 'Organic']),
  JSON.stringify(['Soy'])
);

// 5. Seed Demo User Address
const insertAddress = db.prepare(`
  INSERT OR REPLACE INTO addresses (id, user_id, address_line1, address_line2, city, pincode, delivery_instructions, is_default)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertAddress.run(
  'addr_demo_1',
  'user_demo_nala',
  'Flat 402, Green Acres Residency',
  'Indiranagar 10th Main',
  'Bengaluru',
  '560038',
  'Ring doorbell twice. Leave on porch table if unavailable.',
  1
);

// 6. Seed Active Subscription for Demo User
const insertSubscription = db.prepare(`
  INSERT OR REPLACE INTO user_subscriptions (id, user_id, plan_id, status, start_date, end_date, renewal_date, meal_types)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const today = new Date();
const endDate = new Date();
endDate.setDate(today.getDate() + 26);

insertSubscription.run(
  'sub_demo_1',
  'user_demo_nala',
  'plan_weekly_bd',
  'active',
  today.toISOString().split('T')[0],
  endDate.toISOString().split('T')[0],
  endDate.toISOString().split('T')[0],
  JSON.stringify(['breakfast', 'dinner'])
);

// 7. Seed Initial Weekly Plan Selections
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const insertWeeklyPlan = db.prepare(`
  INSERT OR REPLACE INTO weekly_plans (id, user_id, subscription_id, week_start_date, day_of_week, meal_type, meal_id, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Get Monday of current week
const currentMonday = new Date();
const dayOfWeek = currentMonday.getDay();
const diffToMon = currentMonday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
currentMonday.setDate(diffToMon);
const weekStartDate = currentMonday.toISOString().split('T')[0];

days.forEach((day, idx) => {
  insertWeeklyPlan.run(
    `wp_${day}_b`,
    'user_demo_nala',
    'sub_demo_1',
    weekStartDate,
    day,
    'breakfast',
    idx % 2 === 0 ? 'meal_masala_dosa' : 'meal_avocado_toast',
    idx === 0 ? 'delivered' : 'scheduled'
  );

  insertWeeklyPlan.run(
    `wp_${day}_d`,
    'user_demo_nala',
    'sub_demo_1',
    weekStartDate,
    day,
    'dinner',
    idx % 2 === 0 ? 'meal_paneer_salad' : 'meal_dal_khichdi',
    'scheduled'
  );
});

// 8. Seed Initial Activity Logs
const insertLog = db.prepare(`
  INSERT OR REPLACE INTO activity_logs (id, user_id, action, description)
  VALUES (?, ?, ?, ?)
`);

insertLog.run('log_1', 'user_demo_nala', 'DELIVERY_SUCCESS', 'Breakfast delivered successfully (Classic Masala Dosa).');
insertLog.run('log_2', 'user_demo_nala', 'PLAN_UPDATED', 'Weekly meals updated for current week.');
insertLog.run('log_3', 'user_demo_nala', 'SUBSCRIPTION_RENEWAL', 'Subscription set to auto-renew in 12 days.');

console.log('Database seeding completed successfully!');
