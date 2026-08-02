/**
 * Migration: Recreate weekly_plans table with nullable meal_id
 * This allows skipped/paused meals to have no meal reference.
 */
const db = require('./database');

console.log('Starting weekly_plans migration...');

db.exec(`
  -- Create new table with nullable meal_id
  CREATE TABLE IF NOT EXISTS weekly_plans_new (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subscription_id TEXT NOT NULL,
    week_start_date DATE NOT NULL,
    day_of_week TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    meal_id TEXT,
    status TEXT DEFAULT 'scheduled',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id),
    FOREIGN KEY (meal_id) REFERENCES meals(id),
    UNIQUE(user_id, week_start_date, day_of_week, meal_type)
  );

  -- Copy existing data
  INSERT OR IGNORE INTO weekly_plans_new SELECT * FROM weekly_plans;

  -- Drop old table and rename
  DROP TABLE IF EXISTS weekly_plans;
  ALTER TABLE weekly_plans_new RENAME TO weekly_plans;
`);

console.log('Migration complete: weekly_plans table now supports nullable meal_id.');
process.exit(0);
