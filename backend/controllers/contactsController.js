const TrustedContact = require('../models/TrustedContact');

function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const contactsController = {
    getAll(req, res) {
        const contacts = TrustedContact.findAllByUser(req.userId);
        return res.json(contacts);
    },

    getOne(req, res) {
        const contact = TrustedContact.findById(Number(req.params.id), req.userId);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        return res.json(contact);
    },

    create(req, res) {
        const { name, phone, relationship, email } = req.body;

        if (!name || !phone || !relationship) {
            return res.status(400).json({ error: 'Name, phone, and relationship are required' });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: 'Contact name must be at least 2 characters' });
        }
        if (!validatePhone(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }
        if (email && !validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const id = TrustedContact.create({
            userId: req.userId,
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim(),
            email: email ? email.trim() : null
        });

        const contact = TrustedContact.findById(id, req.userId);
        return res.status(201).json(contact);
    },

    update(req, res) {
        const { name, phone, relationship, email } = req.body;
        const contactId = Number(req.params.id);

        if (!name || !phone || !relationship) {
            return res.status(400).json({ error: 'Name, phone, and relationship are required' });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: 'Contact name must be at least 2 characters' });
        }
        if (!validatePhone(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }
        if (email && !validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existing = TrustedContact.findById(contactId, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        TrustedContact.update(contactId, req.userId, {
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim(),
            email: email ? email.trim() : null
        });

        const updated = TrustedContact.findById(contactId, req.userId);
        return res.json(updated);
    },

    delete(req, res) {
        const contactId = Number(req.params.id);
        const existing = TrustedContact.findById(contactId, req.userId);
        if (!existing) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        TrustedContact.delete(contactId, req.userId);
        return res.json({ message: 'Contact deleted successfully' });
    }
};

module.exports = contactsController;
