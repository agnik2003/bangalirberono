const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const rawId = req.body?.id != null ? String(req.body.id).trim() : '';
  const rawPassword = req.body?.password != null ? String(req.body.password).trim() : '';
  const ADMIN_CREDENTIALS = {
    id: (process.env.ADMIN_ID || 'admin').trim(),
    password: (process.env.ADMIN_PASSWORD || '1234').trim()
  };
  
  if (rawId === ADMIN_CREDENTIALS.id && rawPassword === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    
    const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

exports.checkAuth = (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.status(200).json({ success: true, message: 'Authenticated' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  res.cookie('token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};
