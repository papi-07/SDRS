const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'sdrs_jwt_secret_key_change_in_production';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

if (!process.env.JWT_SECRET) {
    console.warn('[SDRS] WARNING: JWT_SECRET env variable is not set. Using default secret. Set JWT_SECRET in production!');
}

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { authenticate, JWT_SECRET };
