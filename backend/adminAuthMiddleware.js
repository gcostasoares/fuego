// backend/middleware/authenticateAdmin.js
const jwt = require('jsonwebtoken');

module.exports = function authenticateAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key === process.env.ADMIN_KEY) return next();

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = auth.slice(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    if (payload.email !== process.env.ADMIN_EMAIL)
      return res.status(403).json({ error: 'Forbidden: admin only' });
    req.user = payload;
    next();
  });
};
