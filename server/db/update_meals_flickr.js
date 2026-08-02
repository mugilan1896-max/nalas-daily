const db = require('./database');

const getImg = (tags, lock) => `https://loremflickr.com/800/600/${tags}/all?lock=${lock}`;

const meals = [
  // BREAKFAST
  { id: 'b_idly', title: 'Idly (4 Nos)', category: 'breakfast', description: 'Soft, fluffy steamed rice cakes served with sambar and coconut chutney.', image_url: getImg('idli,sambar', 1), calories: 250, protein_g: 8.0, carbs_g: 50.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Gluten-Free']), is_available: 1, price: 50 },
  { id: 'b_dosai', title: 'Dosai (3 Nos)', category: 'breakfast', description: 'Crispy golden crepes served with sambar and chutney.', image_url: getImg('dosa,food', 2), calories: 300, protein_g: 7.0, carbs_g: 45.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_pongal', title: 'Pongal (1 No)', category: 'breakfast', description: 'Savory rice and lentil porridge seasoned with black pepper and cumin.', image_url: getImg('pongal,food', 3), calories: 350, protein_g: 12.0, carbs_g: 60.0, fat_g: 15.0, tags: JSON.stringify(['Vegetarian', 'Comfort Food']), is_available: 1, price: 50 },
  { id: 'b_poori', title: 'Poori (3 Nos)', category: 'breakfast', description: 'Deep-fried Indian bread served with spiced potato curry.', image_url: getImg('poori,food', 4), calories: 450, protein_g: 6.0, carbs_g: 55.0, fat_g: 20.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_chapathi', title: 'Chapathi (3 Nos)', category: 'breakfast', description: 'Soft whole wheat flatbreads served with vegetable kurma.', image_url: getImg('chapati,food', 5), calories: 300, protein_g: 9.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'High Fiber']), is_available: 1, price: 50 },
  { id: 'b_kichadi', title: 'Kichadi (1 No)', category: 'breakfast', description: 'Savory semolina dish cooked with vegetables and mild spices.', image_url: getImg('upma,food', 6), calories: 280, protein_g: 6.0, carbs_g: 40.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'b_aappam', title: 'Aappam (3 Nos)', category: 'breakfast', description: 'Lace hoppers with a soft center and crispy edges, served with coconut milk.', image_url: getImg('appam,food', 7), calories: 240, protein_g: 4.0, carbs_g: 52.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Gluten-Free']), is_available: 1, price: 50 },
  { id: 'b_kuzhi', title: 'Kuzhi Paniyaram (5 Nos)', category: 'breakfast', description: 'Crispy savory dumplings made from fermented batter.', image_url: getImg('paniyaram,food', 8), calories: 320, protein_g: 7.0, carbs_g: 55.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },

  // LUNCH
  { id: 'l_meals', title: 'Meals', category: 'lunch', description: 'Traditional South Indian vegetarian full meal served on a banana leaf.', image_url: getImg('thali,food', 9), calories: 600, protein_g: 18.0, carbs_g: 90.0, fat_g: 15.0, tags: JSON.stringify(['Vegetarian', 'Full Meal']), is_available: 1, price: 110 },
  { id: 'l_nonveg_meals', title: 'Non Veg Meals', category: 'lunch', description: 'Authentic South Indian non-vegetarian full meal with chicken or fish curry.', image_url: getImg('chicken,thali', 10), calories: 750, protein_g: 35.0, carbs_g: 85.0, fat_g: 25.0, tags: JSON.stringify(['Non-Veg', 'High Protein', 'Full Meal']), is_available: 1, price: 150 },
  { id: 'l_malli', title: 'Malli Rice', category: 'lunch', description: 'Fragrant rice flavored with fresh coriander leaves and spices.', image_url: getImg('coriander,rice', 11), calories: 350, protein_g: 6.0, carbs_g: 60.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_kovakai', title: 'Kovakai Rice', category: 'lunch', description: 'Stir-fried ivy gourd mixed with seasoned rice.', image_url: getImg('vegetable,rice', 12), calories: 380, protein_g: 7.0, carbs_g: 65.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_coconut', title: 'Coconut Rice', category: 'lunch', description: 'Rice cooked with freshly grated coconut and tempered with cashews.', image_url: getImg('coconut,rice', 13), calories: 420, protein_g: 5.0, carbs_g: 60.0, fat_g: 18.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_tomato', title: 'Tomato Rice', category: 'lunch', description: 'Tangy and spicy rice cooked with ripe tomatoes and herbs.', image_url: getImg('tomato,rice', 14), calories: 360, protein_g: 6.0, carbs_g: 65.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_lemon', title: 'Lemon Rice', category: 'lunch', description: 'Zesty lemon-flavored rice tempered with peanuts and mustard seeds.', image_url: getImg('lemon,rice', 15), calories: 370, protein_g: 6.0, carbs_g: 65.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_curd', title: 'Curd Rice', category: 'lunch', description: 'Cooling yogurt rice tempered with mustard, curry leaves, and pomegranate.', image_url: getImg('curd,rice', 16), calories: 310, protein_g: 8.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'Cooling']), is_available: 1, price: 70 },
  { id: 'l_pudina', title: 'Pudina Rice', category: 'lunch', description: 'Mint-flavored rice blended with aromatic spices.', image_url: getImg('mint,rice', 17), calories: 340, protein_g: 6.0, carbs_g: 60.0, fat_g: 9.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_puliyotharai', title: 'Puliyotharai Rice', category: 'lunch', description: 'Traditional tangy tamarind rice mixed with peanuts and spices.', image_url: getImg('tamarind,rice', 18), calories: 400, protein_g: 7.0, carbs_g: 70.0, fat_g: 14.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 70 },
  { id: 'l_vegbiryani', title: 'Veg Biryani', category: 'lunch', description: 'Aromatic basmati rice cooked with mixed vegetables and rich spices.', image_url: getImg('biryani,food', 19), calories: 450, protein_g: 10.0, carbs_g: 75.0, fat_g: 12.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 80 },

  // DINNER
  { id: 'd_idly', title: 'Idly (4 Nos)', category: 'dinner', description: 'Soft, fluffy steamed rice cakes served with sambar and coconut chutney.', image_url: getImg('idli,sambar', 1), calories: 250, protein_g: 8.0, carbs_g: 50.0, fat_g: 2.0, tags: JSON.stringify(['Vegetarian', 'Light Dinner']), is_available: 1, price: 50 },
  { id: 'd_dosai', title: 'Dosai (3 Nos)', category: 'dinner', description: 'Crispy golden crepes served with sambar and chutney.', image_url: getImg('dosa,food', 2), calories: 300, protein_g: 7.0, carbs_g: 45.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 },
  { id: 'd_chapathi', title: 'Chapathi (3 Nos)', category: 'dinner', description: 'Soft whole wheat flatbreads served with vegetable kurma.', image_url: getImg('chapati,food', 5), calories: 300, protein_g: 9.0, carbs_g: 50.0, fat_g: 8.0, tags: JSON.stringify(['Vegetarian', 'High Fiber']), is_available: 1, price: 50 },
  { id: 'd_kichadi', title: 'Kichadi (1 No)', category: 'dinner', description: 'Savory semolina dish cooked with vegetables and mild spices.', image_url: getImg('upma,food', 6), calories: 280, protein_g: 6.0, carbs_g: 40.0, fat_g: 10.0, tags: JSON.stringify(['Vegetarian']), is_available: 1, price: 50 }
];

console.log('Deleting old meals...');
db.prepare('DELETE FROM meals').run();

console.log('Inserting new meals...');
const insertMeal = db.prepare(`
  INSERT INTO meals (id, title, category, description, image_url, calories, protein_g, carbs_g, fat_g, tags, is_available, price)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
  for (const meal of meals) {
    insertMeal.run(
      meal.id, meal.title, meal.category, meal.description,
      meal.image_url, meal.calories, meal.protein_g, meal.carbs_g,
      meal.fat_g, meal.tags, meal.is_available, meal.price
    );
  }
})();

console.log('Successfully updated meals catalog.');
