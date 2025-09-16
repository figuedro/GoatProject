// Database configuration and connection
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'database', 'goat.db');

// Create connection to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create tables if they don't exist
        initializeTables();
    }
});

// Initialize database tables
function initializeTables() {
    // Tabela de usuários para o sistema Goat
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeCompleto TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        curso TEXT NOT NULL,
        semestre INTEGER NOT NULL,
        senha TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating usuarios table:', err.message);
        } else {
            console.log('Usuarios table ready.');
        }
    });
    
    // Example table creation (mantendo para compatibilidade)
    db.run(`CREATE TABLE IF NOT EXISTS goats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        breed TEXT,
        age INTEGER,
        weight REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating goats table:', err.message);
        } else {
            console.log('Goats table ready.');
        }
    });
}

module.exports = db;