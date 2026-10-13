const jwt = require('jsonwebtoken');
const AdminSession = require('../models/AdminSession');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Validate session in MongoDB
    const session = await AdminSession.findOne({ token });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired or not found in database' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
