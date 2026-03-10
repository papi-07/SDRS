const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const SALT_ROUNDS = 12;

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const authController = {
    async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }

        const existing = User.findByEmail(email.toLowerCase());
        if (existing) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const id = User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed });

        const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
        const user = User.findById(id);

        return res.status(201).json({ token, user });
    },

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = User.findByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _pw, ...safeUser } = user;

        return res.json({ token, user: safeUser });
    },

    logout(req, res) {
        // JWT is stateless; client discards token
        return res.json({ message: 'Logged out successfully' });
    }
};

module.exports = authController;
