const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { id, password } = req.body;
  const ADMIN_CREDENTIALS = {
    id: process.env.ADMIN_ID,
    password: process.env.ADMIN_PASSWORD
  };
  
  if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

exports.checkAuth = (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.status(200).json({ success: true, message: 'Authenticated' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 0, httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out' });
};
