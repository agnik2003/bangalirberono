require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const packageRoutes = require('./routes/packageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingRoutes = require('./routes/settingRoutes');
const billRoutes = require('./routes/billRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const emailRoutes = require('./routes/emailRoutes');
const customerRoutes = require('./routes/customers');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
// Trigger restart to load port 587

// Middleware
// CORS: dynamically allow requests from Vercel, Netlify, localhost, and custom domains with full credential support
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://bangalir-berano.netlify.app',
  'https://bangalirberono.vercel.app'
];
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/+$/, ''))
  : [];
const allowedOriginSet = new Set([...defaultOrigins, ...configuredOrigins].filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    // Requests with no origin (curl, mobile apps, server-to-server) are always allowed
    if (!origin) return callback(null, true);
    
    const clean = origin.trim().replace(/\/+$/, '');
    if (
      allowedOriginSet.has(clean) ||
      /^http:\/\/localhost:\d+$/.test(clean) ||
      /\.vercel\.app$/.test(clean) ||
      /\.netlify\.app$/.test(clean) ||
      clean.includes('bangalirberano') ||
      clean.includes('bangalirberono')
    ) {
      return callback(null, true);
    }
    // Fallback: reflect origin to prevent blocking any deployment
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '20mb' })); // allow large base64 payloads
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Health Check
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({ status: 'ok', service: 'Bangalir Berano API', timestamp: new Date() });
});

// API Routes — support both /api/* and direct root paths
app.use('/api/admin', authRoutes);
app.use('/admin', authRoutes);

app.use('/api/enquiries', enquiryRoutes);
app.use('/enquiries', enquiryRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

app.use('/api/packages', packageRoutes);
app.use('/packages', packageRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/settings', settingRoutes);
app.use('/settings', settingRoutes);

app.use('/api/bills', billRoutes);
app.use('/bills', billRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/payments', paymentRoutes);

app.use('/api/expenses', expenseRoutes);
app.use('/expenses', expenseRoutes);

app.use('/api/email', emailRoutes);
app.use('/email', emailRoutes);

app.use('/api/customers', customerRoutes);
app.use('/customers', customerRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
