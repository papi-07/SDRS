const db = require('./db');

const User = {
    findByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },

    findById(id) {
        return db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
    },

    create({ name, email, password }) {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const result = stmt.run(name, email, password);
        return result.lastInsertRowid;
    }
};

module.exports = User;
