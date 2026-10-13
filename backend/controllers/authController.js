const jwt = require('jsonwebtoken');
const AdminSession = require('../models/AdminSession');

exports.login = async (req, res) => {
  const rawId = req.body?.id != null ? String(req.body.id).trim() : '';
  const rawPassword = req.body?.password != null ? String(req.body.password).trim() : '';
  const ADMIN_CREDENTIALS = {
    id: (process.env.ADMIN_ID || 'admin').trim(),
    password: (process.env.ADMIN_PASSWORD || '1234').trim()
  };
  
  if (rawId === ADMIN_CREDENTIALS.id && rawPassword === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    
    // Store session directly in MongoDB database
    try {
      await AdminSession.create({
        adminId: ADMIN_CREDENTIALS.id,
        token,
        ip: req.ip || req.headers['x-forwarded-for'] || '',
        userAgent: req.headers['user-agent'] || ''
      });
    } catch (err) {
      console.error('Failed to create session in MongoDB:', err);
    }

    const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      partitioned: isProduction,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

exports.checkAuth = async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Verify session exists in MongoDB database
    const dbSession = await AdminSession.findOne({ token });
    if (!dbSession) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    res.status(200).json({ success: true, message: 'Authenticated' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) {
    try {
      await AdminSession.deleteMany({ token });
    } catch (err) {
      console.error('Error removing session from DB:', err);
    }
  }

  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  res.cookie('token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    partitioned: isProduction,
    path: '/'
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};
