const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'nalas_daily.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : null });

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Read schema and initialize tables
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('SQLite database initialized successfully.');

module.exports = db;
