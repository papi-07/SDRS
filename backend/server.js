const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const { authenticate } = require('./middleware/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

const staticLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
});

// Serve static frontend files
app.use(staticLimiter);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contacts', apiLimiter, contactRoutes);

// Protected: get current user profile
app.get('/api/me', apiLimiter, authenticate, (req, res) => {
    const user = User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
});

// Catch-all: serve frontend
app.get('/{*path}', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`SDRS server running at http://localhost:${PORT}`);
});

module.exports = app;
