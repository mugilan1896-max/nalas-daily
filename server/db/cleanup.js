const db = require('./database');

// Remove meals that no longer have image files
const result = db.prepare("DELETE FROM meals WHERE id IN ('l_meals', 'l_nonveg_meals')").run();
console.log(`Removed ${result.changes} meals without images from database.`);

// Verify remaining meals
const meals = db.prepare('SELECT id, title, image_url FROM meals ORDER BY id').all();
console.log(`\nRemaining ${meals.length} meals:`);
meals.forEach(m => console.log(`  ${m.id} | ${m.title} | ${m.image_url}`));
