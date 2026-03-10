const db = require('./db');

const TrustedContact = {
    findAllByUser(userId) {
        return db.prepare('SELECT * FROM trusted_contacts WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    },

    findById(id, userId) {
        return db.prepare('SELECT * FROM trusted_contacts WHERE id = ? AND user_id = ?').get(id, userId);
    },

    create({ userId, name, phone, relationship, email }) {
        const stmt = db.prepare(
            'INSERT INTO trusted_contacts (user_id, name, phone, relationship, email) VALUES (?, ?, ?, ?, ?)'
        );
        const result = stmt.run(userId, name, phone, relationship, email || null);
        return result.lastInsertRowid;
    },

    update(id, userId, { name, phone, relationship, email }) {
        const stmt = db.prepare(
            'UPDATE trusted_contacts SET name = ?, phone = ?, relationship = ?, email = ? WHERE id = ? AND user_id = ?'
        );
        const result = stmt.run(name, phone, relationship, email || null, id, userId);
        return result.changes;
    },

    delete(id, userId) {
        const stmt = db.prepare('DELETE FROM trusted_contacts WHERE id = ? AND user_id = ?');
        const result = stmt.run(id, userId);
        return result.changes;
    }
};

module.exports = TrustedContact;
