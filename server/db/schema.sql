-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    credits INTEGER DEFAULT 0,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OTP Store Table
CREATE TABLE IF NOT EXISTS otps (
    phone_number TEXT PRIMARY KEY,
    otp_code TEXT NOT NULL,
    expires_at DATETIME NOT NULL
);

-- Pet / User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pet_name TEXT NOT NULL,
    pet_type TEXT DEFAULT 'dog',
    breed TEXT,
    age_years INTEGER,
    weight_kg REAL,
    dietary_preferences TEXT,
    allergies TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    price_per_day REAL NOT NULL,
    meals_per_day INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    credits_included INTEGER DEFAULT 0,
    plan_type TEXT DEFAULT 'weekly',
    meal_label TEXT,
    total_price REAL,
    is_popular INTEGER DEFAULT 0,
    badge TEXT
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    renewal_date DATE,
    meal_types TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Meals Catalog Table
CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    tags TEXT,
    is_available INTEGER DEFAULT 1,
    price REAL DEFAULT 0
);

-- Weekly Plans Table
CREATE TABLE IF NOT EXISTS weekly_plans (
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

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    subscription_id TEXT,
    delivery_date DATE NOT NULL,
    delivery_time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    address_id TEXT NOT NULL,
    total_amount REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    meal_id TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meals(id)
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
