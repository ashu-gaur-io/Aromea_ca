const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database('./aromea.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
