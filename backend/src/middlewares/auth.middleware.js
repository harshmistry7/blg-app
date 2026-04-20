const jwt = require('jsonwebtoken');

function getTokenFromCookie(cookieHeader) {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const [key, ...value] = cookie.trim().split('=');
        if (key === 'token') {
            return value.join('=');
        }
    }

    return null;
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        token = getTokenFromCookie(req.headers.cookie);
    }

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized: token missing',
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: 'JWT secret is not configured',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized: invalid token',
        });
    }
}

module.exports = authMiddleware;